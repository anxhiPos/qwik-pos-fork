import { $, component$, useContext } from "@builder.io/qwik";
import { UiContext } from "~/routes/layout";
import { IcRoundMenu, IcRoundNotifications } from "../icons";

type Props = {
  title: string;
  onSearch?: (e: Event) => void;
};
export const NavBar = component$<Props>(({ title, onSearch }) => {
  const uiStore = useContext(UiContext);

  const toggleSidebar = $(() => {
    uiStore.isSidebarOpen = !uiStore.isSidebarOpen;
  });
  return (
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <div class="flex-none md:hidden">
          <button class="btn btn-square btn-ghost" onClick$={toggleSidebar}>
            <IcRoundMenu />
          </button>
        </div>
        <div class="flex-1">
          <p class="btn btn-ghost text-xl normal-case">{title}</p>
        </div>
      </div>
      <div class="navbar-center">
        <div class="form-control">
          <input
            type="text"
            placeholder="Search"
            class="input input-bordered w-24 md:w-auto"
            onInput$={onSearch}
          />
        </div>
      </div>
      <div class="navbar-end">
        <div class="flex-none gap-2">
          <button class="btn btn-circle btn-ghost">
            <div class="indicator">
              <IcRoundNotifications />
              <span class="badge indicator-item badge-primary badge-xs"></span>
            </div>
          </button>
          <div class="dropdown-end dropdown">
            <label tabIndex={0} class="avatar btn btn-circle btn-ghost">
              <div class="w-10 rounded-full">
                {/* <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
              </div>
            </label>
            <ul
              tabIndex={0}
              class="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <p class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </p>
              </li>
              <li>
                <p>Settings</p>
              </li>
              <li>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
