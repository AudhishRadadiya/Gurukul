import type {
  IDoesFilterPassParams,
  IFilterComp,
  IFilterParams,
} from "ag-grid-community";

type FilterOption = {
  filterFunction?: (value: string) => boolean;
  label: string;
  value: string;
};

type CustomEnumFilterParams = {
  filterOptions: FilterOption[];
  source: "client" | "server";
} & IFilterParams;

export type CustomEnumFilterModel = {
  filter: string;
  filterType: string;
  type: string;
};

export class CustomEnumFilter implements IFilterComp {
  filterParams!: CustomEnumFilterParams;
  selectedValue: string;
  filterType!: string;
  type: string;
  gui!: HTMLDivElement;
  filterOptions: FilterOption[];

  defaultFilterOptions: FilterOption[] = [
    {
      filterFunction: () => true,
      label: "All",
      value: "all",
    },
  ];

  constructor() {
    this.filterOptions = this.defaultFilterOptions;
    this.selectedValue = "all";
    this.type = "equals";
  }

  private applyFilterOptionsFromParams(params: CustomEnumFilterParams) {
    if (!params.filterOptions?.length) {
      return;
    }

    this.filterOptions = [
      {
        filterFunction: () => true,
        label: "All",
        value: "all",
      },
      ...params.filterOptions.map(
        (o): FilterOption => ({
          filterFunction: o.filterFunction,
          label: o.label,
          value: String(o.value),
        })
      ),
    ];
  }

  private static buildEnumFilterHtml(options: FilterOption[]) {
    const optionItems = options
      .map(
        (opt) =>
          `<li class="ag-custom-enum-filter-option" role="option" data-value="${opt.value}" aria-selected="false">${opt.label}</li>`
      )
      .join("");

    return `
      <div class="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
        <div class="ag-custom-enum-filter ag-picker-field ag-labeled ag-label-align-left ag-select ag-filter-select">
          <div class="ag-custom-enum-filter-trigger" role="combobox" aria-expanded="false" aria-haspopup="listbox" tabindex="0">
            <span class="ag-custom-enum-filter-label"></span>
            <span class="ag-custom-enum-filter-chevron" aria-hidden="true"></span>
          </div>
          <ul class="ag-custom-enum-filter-panel" role="listbox" hidden>
            ${optionItems}
          </ul>
        </div>
      </div>
    `;
  }

  /** Updates label, aria-selected, and selected styling from `this.selectedValue`. */
  private syncEnumFilterUi() {
    if (!this.gui) {
      return;
    }

    const label = this.gui.querySelector<HTMLElement>(
      ".ag-custom-enum-filter-label"
    );

    const panel = this.gui.querySelector<HTMLElement>(
      ".ag-custom-enum-filter-panel"
    );

    const sel = this.filterOptions.find((o) => o.value === this.selectedValue);

    if (label) {
      label.textContent = sel?.label ?? "All";
    }

    if (!panel) {
      return;
    }

    panel
      .querySelectorAll<HTMLElement>(".ag-custom-enum-filter-option")
      .forEach((el) => {
        const active = el.dataset.value === this.selectedValue;

        el.setAttribute("aria-selected", String(active));
        el.classList.toggle("ag-custom-enum-filter-option--selected", active);
      });
  }

  init(params: CustomEnumFilterParams) {
    this.filterParams = params;
    this.applyFilterOptionsFromParams(params);

    this.filterType = "text";
    this.selectedValue = this.filterOptions[0]?.value ?? "all";

    this.gui = document.createElement("div");
    this.gui.className = "ag-custom-enum-filter-root";
    this.gui.innerHTML = CustomEnumFilter.buildEnumFilterHtml(
      this.filterOptions
    );

    const trigger = this.gui.querySelector(
      ".ag-custom-enum-filter-trigger"
    ) as HTMLElement;

    const panel = this.gui.querySelector(
      ".ag-custom-enum-filter-panel"
    ) as HTMLElement;

    const openPanel = () => {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      trigger.classList.add("ag-custom-enum-filter-trigger--open");
    };

    const closePanel = () => {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      trigger.classList.remove("ag-custom-enum-filter-trigger--open");
    };

    const togglePanel = () => {
      if (panel.hidden) {
        openPanel();
      } else {
        closePanel();
      }
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePanel();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePanel();
      } else if (e.key === "Escape") {
        closePanel();
      }
    });

    panel.addEventListener("click", (e) => {
      const opt = (e.target as HTMLElement).closest<HTMLElement>(
        ".ag-custom-enum-filter-option"
      );

      if (!opt) {
        return;
      }
      this.selectedValue = opt.dataset.value ?? "all";
      this.syncEnumFilterUi();
      closePanel();
      params.filterChangedCallback();
    });

    document.addEventListener(
      "mousedown",
      (e) => {
        if (!this.gui.contains(e.target as Node)) {
          closePanel();
        }
      },
      true
    );

    this.syncEnumFilterUi();
  }

  getGui() {
    return this.gui;
  }

  doesFilterPass(params: IDoesFilterPassParams) {
    const { node } = params;

    const value = this.filterParams.getValue(node);

    const cellValue =
      value === null || value === undefined ? "" : String(value).toLowerCase();

    if (this.selectedValue === "all") {
      return true;
    }

    const selectedOption = this.filterOptions.find(
      (opt) => opt.value === this.selectedValue
    );

    if (selectedOption?.filterFunction) {
      return selectedOption.filterFunction(cellValue);
    }

    return cellValue === this.selectedValue.toLowerCase();
  }

  isFilterActive() {
    return this.selectedValue !== "all";
  }

  getModel(): CustomEnumFilterModel | null {
    if (this.selectedValue === "all") {
      return null;
    }

    return {
      filter: this.selectedValue,
      filterType: this.filterParams.source === "client" ? "customEnum" : "text",
      type: this.type,
    };
  }

  setModel(model: CustomEnumFilterModel | null) {
    this.selectedValue = model?.filter ? String(model.filter) : "all";

    this.syncEnumFilterUi();
  }
}
