export const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    clip: 'rect(0 0 0 0)',
}

// Function to calculate the number of empty rows required at the end of a paginated table
// - page: the current page number
// - rowsPerPage: the number of rows per page
// - arrayLength: total number of items in the array
export function emptyRows(page, rowsPerPage, arrayLength) {
    return Math.max(0, (1 + page) * rowsPerPage - arrayLength);
}

// Comparator for sorting in descending order
// - a, b: items to compare
// - orderBy: the property to sort by
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

// Returns a comparator function based on the order (asc/desc) and the property to sort by
// - order: 'asc' or 'desc'
// - orderBy: the property to sort by
export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Function to apply sorting and filtering to data
// - inputData: array of objects to filter/sort
// - comparator: function to sort the array
// - filterName: filter text for searching by name property
export function applyFilter({ inputData, comparator, filterName, attribute }) {
    // Stabilize the array by keeping track of original indices
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    // Sort the array based on the comparator, maintaining the original index if values are equal
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    // Map sorted array back to its original structure
    inputData = stabilizedThis.map((el) => el[0]);

    // Apply filtering if filterName is provided
    if (filterName && attribute) {
        const normalizeText = (text) => {
            return text
                .normalize('NFD') // Normalize to decompose characters into their base and accent components
                .replace(/[\u0300-\u036f]/g, '') // Remove the diacritical marks (accents)
                .toLowerCase(); // Convert to lowercase
        };

        inputData = inputData.filter((data) => {
            const dataValue = data[attribute] ? data[attribute].toLowerCase() : '';
            const normalizedDataValue = normalizeText(dataValue);
            const normalizedFilterName = normalizeText(filterName);

            return normalizedDataValue.indexOf(normalizedFilterName) !== -1;
        });
    }

    return inputData;
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
