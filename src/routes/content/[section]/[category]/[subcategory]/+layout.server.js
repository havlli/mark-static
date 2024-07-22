export async function load({ params }) {
	return {
		category: params.category,
		subcategory: params.subcategory
	}
}