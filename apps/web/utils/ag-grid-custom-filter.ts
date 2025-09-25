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
  eFilterType!: HTMLSelectElement;

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

  init(params: CustomEnumFilterParams) {
    this.filterParams = params;

    if (params.filterOptions && params.filterOptions.length > 0) {
      this.filterOptions = [
        {
          filterFunction: () => true,
          label: "All",
          value: "all",
        },
        ...params.filterOptions,
      ];
    }
    this.filterType = "text";
    this.selectedValue = this.filterOptions[0]?.value ?? "all";
    this.setupGui();
    this.setupListeners(params);
  }

  setupGui() {
    this.gui = document.createElement("div");

    this.gui.innerHTML = `
            <div class="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
                <div class="ag-picker-field ag-labeled ag-label-align-left ag-select ag-filter-select">
                    <select id="filterType" class="ag-wrapper ag-picker-field-wrapper ag-picker-collapsed">
                        ${this.filterOptions
                          .map(
                            (option) =>
                              `<option class="ag-picker-field-display" value="${option.value}">${option.label}</option>`
                          )
                          .join("")}
                    </select>
                </div>
            </div>
        `;

    this.eFilterType = this.gui.querySelector(
      "#filterType"
    ) as HTMLSelectElement;

    this.eFilterType.value = this.selectedValue;
  }

  setupListeners(params: CustomEnumFilterParams) {
    this.eFilterType.addEventListener("change", (event: Event) => {
      const select = event.target as HTMLSelectElement;

      this.selectedValue = select.value;
      params.filterChangedCallback();
    });
  }

  getGui() {
    return this.gui;
  }

  doesFilterPass(params: IDoesFilterPassParams) {
    const { node } = params;

    const value = this.filterParams.getValue(node);

    const cellValue = value ? value.toString().toLowerCase() : "";

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
    if (model?.filter) {
      this.selectedValue = model.filter;

      if (this.eFilterType) {
        this.eFilterType.value = model.filter;
      }
    } else {
      this.selectedValue = "all";

      if (this.eFilterType) {
        this.eFilterType.value = "all";
      }
    }
  }
}
