import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues, ResponseData } from "@modular-forms/qwik";
import {
  formAction$,
  getErrors,
  useFormStore,
  valiForm$,
} from "@modular-forms/qwik";
import { OrderForm } from "~/components/forms/order";
import { getAllItems } from "~/lib/queries/items";
import { getOrderPref } from "~/lib/queries/order-pref";
import { successToast } from "~/providers/toast";
import type { OrderFormType } from "~/types-and-validation/orderSchema";
import { OrderSchema } from "~/types-and-validation/orderSchema";
import { getSessionSS } from "~/utils/auth";

export const useFormAction = formAction$<OrderFormType, ResponseData>(
  async (values) => {
    console.log("values", values);
  },
  valiForm$(OrderSchema),
);

export const useItemsLoader = routeLoader$(async (event) => {
  const session = getSessionSS(event);
  const items = await getAllItems(session.shopId);

  return items;
});

export const useFormLoader = routeLoader$<InitialValues<OrderFormType>>(
  async (event) => {
    const session = getSessionSS(event);

    const pref = await getOrderPref(session.shopId, session.userId);
    console.log("pref", pref);

    return {
      date: "",
      currency: pref?.currency,
      // customerId: "",
      exchangeRate: 1,
      payment: {
        method: pref?.paymentMethod,
        // amount: 0,
        // currency: "",
      },
      discount: {
        amount: 0,
        type: "",
      },
      items: [
        {
          // id: "",
          name: "",
          unit: "",
          quantity: 0,
          unitPrice: 0,
          unitPriceWithTax: 0,
        },
      ],
      customer: {
        name: "",
        // id: "",
      },
      docNo: 0,
      // layout: "",
      notes: "",
    };
  },
);

export default component$(() => {
  const action = useFormAction();
  const items = useItemsLoader();

  const form = useFormStore<OrderFormType, ResponseData>({
    loader: useFormLoader(),
    validate: valiForm$(OrderSchema),
    fieldArrays: ["items"],
  });

  const errors = getErrors(form);
  console.log("errors", errors);

  if (action.status === 200) {
    successToast("Order created successfully");
  }
  return (
    <div class="h-full">
      <OrderForm form={form} action={action} items={items} />
    </div>
  );
});
