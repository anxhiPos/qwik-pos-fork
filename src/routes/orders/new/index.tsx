import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type {
  InitialValues,
  ResponseData,
  SubmitHandler,
} from "@modular-forms/qwik";
import {
  formAction$,
  getErrors,
  useFormStore,
  valiForm$,
} from "@modular-forms/qwik";
import { ReceiptDialog } from "~/components/dialogs";
import { OrderForm } from "~/components/forms/order";
import { getAllItems } from "~/lib/queries/items";
import { getOrderPref } from "~/lib/queries/order-pref";
// import { successToast } from "~/providers/toast";
import { prisma } from "~/routes/plugin@auth";
import type { OrderFormType } from "~/types-and-validation/orderSchema";
import { OrderSchema } from "~/types-and-validation/orderSchema";
import { getSessionSS } from "~/utils/auth";

export const useFormAction = formAction$<OrderFormType, ResponseData>(
  async (values, event) => {
    console.log("values", values);
    const session = getSessionSS(event);

    const order = await prisma.order.create({
      data: {
        currency: values.currency,
        date: new Date(),
        customerId: "6572dd392ce8dcf9b2347ac0", // TODO: get from customer
        customerName: values.customer.name,
        discountAmount: values.discount.amount,
        discountType: values.discount.type,
        exchangeRate: values.exchangeRate,
        docNo: values.docNo,
        paymentMethod: values.payment.method,
        items: { create: values.items },
        notes: values.notes,
        shopId: session.shopId,
        userId: session.userId,
      },
    });
    console.log("order", order);
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

  const showReceiptDialog = useSignal(false);
  const order = useSignal<OrderFormType>();

  const form = useFormStore<OrderFormType, ResponseData>({
    loader: useFormLoader(),
    validate: valiForm$(OrderSchema),
    fieldArrays: ["items"],
  });

  const errors = getErrors(form);
  console.log("errors", errors);

  const handleSubmit = $<SubmitHandler<OrderFormType>>((values) => {
    // if (action.status === 200) {
    //   successToast("Order created successfully");
    // }
    showReceiptDialog.value = true;
    order.value = values;
  });
  return (
    <div class="h-full">
      <OrderForm
        form={form}
        action={action}
        items={items}
        handleSubmit={handleSubmit}
      />

      <ReceiptDialog
        show={showReceiptDialog}
        order={order.value}
        hide={$(() => {
          showReceiptDialog.value = false;
        })}
      />
    </div>
  );
});
