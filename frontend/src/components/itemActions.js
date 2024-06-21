// itemActions.js

export const editItem = async (item, procedureName) => {
	try {
		const response = await fetch("/api/edit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ item, procedureName }),
		});

		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}

		const results = await response.json();
		console.log(`Edit item: ${JSON.stringify(results)}`);
	} catch (error) {
		console.error(`Error editing item: ${error.message}`);
	}
};

export const deleteItem = async (item, procedureName) => {
	try {
		const response = await fetch("/api/delete", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ item, procedureName }),
		});

		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}

		const results = await response.json();
		console.log(`Delete item: ${JSON.stringify(results)}`);
	} catch (error) {
		console.error(`Error deleting item: ${error.message}`);
	}
};
