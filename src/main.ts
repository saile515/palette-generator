import "./style.css";

const palette_size_element = document.getElementById("palette-size");
const lightness_equation_element =
  document.getElementById("lightness-equation");
const chroma_equation_element = document.getElementById("chroma-equation");
const hue_equation_element = document.getElementById("hue-equation");
const preview_container_element = document.getElementById("preview-container");
const palette_container_element = document.getElementById("palette-container");
const add_colors_element = document.getElementById("add-colors");

type Color = { lightness: number; chroma: number; hue: number };

const palette: Color[][] = [];
let current_row;

const create_palette_row = (
  palette_size,
  lightness_equation,
  chroma_equation,
  hue_equation,
) => {
  const row: Color[] = [];
  // Aliases. Don't use in code.
  const size = palette_size;
  const l = lightness_equation;
  const c = chroma_equation;
  const h = hue_equation;

  for (let x = 0; x < palette_size; x++) {
    const i = x / (palette_size - 1);
    const lightness_value = eval(lightness_equation);
    const chroma_value = eval(chroma_equation);
    const hue_value = eval(hue_equation);

    row.push({
      lightness: lightness_value,
      chroma: chroma_value,
      hue: hue_value,
    });
  }

  return row;
};

const create_palette_row_element = (row) => {
  const container_element = document.createElement("div");

  row.forEach((color) => {
    const color_string = `oklch(${color.lightness}% ${color.chroma}% ${color.hue}deg)`;
    const color_element = document.createElement("div");
    color_element.classList.add("color");
    color_element.style.background = color_string;
    container_element.append(color_element);
  });

  container_element.classList.add("color-row");

  return container_element;
};

const update_preview = () => {
  const palette_size = palette_size_element.value;
  const lightness_equation = lightness_equation_element.value;
  const chroma_equation = chroma_equation_element.value;
  const hue_equation = hue_equation_element.value;

  const row = create_palette_row(
    palette_size,
    lightness_equation,
    chroma_equation,
    hue_equation,
  );

  preview_container_element.innerHTML = "";

  preview_container_element.append(create_palette_row_element(row));

  current_row = row;
};

const update_preview_on_change = (element) => {
  element.addEventListener("input", update_preview);
};

update_preview_on_change(palette_size_element);
update_preview_on_change(lightness_equation_element);
update_preview_on_change(chroma_equation_element);
update_preview_on_change(hue_equation_element);

update_preview();

const update_palette = () => {
  palette_container_element.innerHTML = "";
  palette.forEach((row) => {
    const row_element = create_palette_row_element(row);
    palette_container_element.append(row_element);
  });
};

add_colors_element.addEventListener("click", () => {
  palette.push(current_row);
  update_palette();
});
