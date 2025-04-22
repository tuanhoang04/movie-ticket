import { useCallback, useState } from "react";

export function hook() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('cinema_name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = useState('asc');

    const onSort = useCallback(
        (id) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked, newSelecteds) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback((inputValue) => {
        const newSelected = selected.includes(inputValue)
            ? selected.filter((value) => value !== inputValue)
            : [...selected, inputValue];

        setSelected(newSelected);
    }, [selected]);

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        onResetPage();
    }, [onResetPage]);

    return {
        page,
        orderBy,
        rowsPerPage,
        selected,
        setSelected,
        order,
        onSort,
        onSelectAllRows,
        onSelectRow,
        onResetPage,
        onChangePage,
        onChangeRowsPerPage
    };
}
