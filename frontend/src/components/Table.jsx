import { useState, useCallback, useEffect, useRef } from "react";

const createHeaders = (headers) => {
	return headers.map((item) => ({
		text: item,
		ref: useRef(),
	}));
};

const Table = ({ headings, tableContent }) => {
	const [tableHeight, setTableHeight] = useState("auto");
	const [activeIndex, setActiveIndex] = useState(null);
	const tableElement = useRef(null);
	const columns = createHeaders(headings);

	return (
		<div className="table-wrapper">
			<table className="resizeable-table" ref={tableElement}>
				<thead>
					<tr>
						{columns.map(({ ref, text }, i) => (
							<th ref={ref} key={text}>
								<span>{text}</span>
								<div
									style={{ height: tableHeight }}
									className={`resize-handle ${
										activeIndex === i ? "active" : "idle"
									}`}
								/>
							</th>
						))}
					</tr>
				</thead>

				{tableContent}
			</table>
		</div>
	);
};

export default Table;
