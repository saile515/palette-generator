import Color from "colorjs.io";
import JSZip from "jszip";

const create_colorset = (palette: Color[][], name: string) => {
  let widest_row = 1;
  palette.forEach((row) => {
    if (row.length > widest_row) {
      widest_row = row.length;
    }
  });

  let colorset = `<Colorset name="${name}" comment="" columns="${widest_row}" rows="${palette.length}" readonly="false" version="1.0">`;

  for (let row = 0; row < palette.length; row++) {
    for (let column = 0; column < palette[row].length; column++) {
      const color = palette[row][column];
      colorset += `   <ColorSetEntry name="" id="" bitdepth="F32" spot="false">
        <sRGB r="${color.srgb.r}" g="${color.srgb.g}" b="${color.srgb.b}"  />
        <Position row="${row}" column="${column}"/>
    </ColorSetEntry>`;
    }
  }

  colorset += "</Colorset>";

  return colorset;
};

export const create_kpl = async (palette: Color[][], name: string) => {
  const zip = new JSZip();

  zip.file("mimetype", "application/x-krita-palette");
  zip.file("colorset.xml", create_colorset(palette, name));
  zip.file(
    "profiles.xml",
    await fetch("/kpl-files/profiles.xml").then((res) => res.text()),
  );
  zip.file(
    "sRGB-elle-V2-srgbtrc.icc",
    await fetch("/kpl-files/sRGB-elle-V2-srgbtrc.icc").then((res) =>
      res.blob(),
    ),
  );

  return await zip.generateAsync({ type: "blob" });
};
