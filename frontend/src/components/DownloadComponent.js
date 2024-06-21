import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export default async function downloadComponentInPDF(Component, Header) {
	const fileName = window.prompt("Enter file name (without extension):");
	if (!fileName) return; // Exit if the user cancels the prompt

	if (!(Component instanceof HTMLElement)) {
		console.error("Invalid element provided as Component");
		return;
	}

	if (Header && !(Header instanceof HTMLElement)) {
		console.error("Invalid element provided as Header");
		return;
	}

	const margin = 40; // Set the margin size

	const headerHeight = Header ? Header.offsetHeight : 0;

	await html2canvas(Component).then((componentCanvas) => {
		const componentWidth = Component.offsetWidth;
		const componentHeight = Component.offsetHeight;

		const orientation =
			componentWidth >= componentHeight + headerHeight ? "l" : "p";

		const imgDataComponent = componentCanvas.toDataURL("image/png");

		const pdf = new jsPDF({
			orientation,
			unit: "px",
		});

		pdf.internal.pageSize.width = componentWidth + 2 * margin;
		pdf.internal.pageSize.height = componentHeight + headerHeight + 2 * margin;

		if (Header) {
			html2canvas(Header).then((headerCanvas) => {
				const imgDataHeader = headerCanvas.toDataURL("image/png");
				pdf.addImage(
					imgDataHeader,
					"PNG",
					margin,
					margin,
					componentWidth,
					headerHeight,
				);
				pdf.addImage(
					imgDataComponent,
					"PNG",
					margin,
					margin + headerHeight,
					componentWidth,
					componentHeight,
				);
				pdf.save(`${fileName}.pdf`);
			});
		} else {
			pdf.addImage(
				imgDataComponent,
				"PNG",
				margin,
				margin,
				componentWidth,
				componentHeight,
			);
			pdf.save(`${fileName}.pdf`);
		}
	});
}
