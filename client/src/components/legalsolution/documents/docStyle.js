export const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 24,
        marginLeft: 24
    },
    paper: {
        flexGrow: 1
    },
    cards: {
        margin: 0,
        padding: 0,
        textAlign: 'left',
        listStyle: 'none'
    },
    card: {
        '&:hover': {
            boxShadow: '0 2px 12px 0 rgba(0,0,0,.2), 0 1px 4px 0 rgba(0,0,0,.05)'
        },
        width: 250,
        height: 55,
        backgroundColor: '#FFF',
        border: '1px solid #E9E9E9',
        display: 'inline-block',
        textAlign: 'center',
        paddingTop: 5,
        position: 'relative',
        boxSizing: 'border-box',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0,0,0,.03)',
        verticalAlign: 'top',
        marginRight: 18,
        marginTop: 12,
    },
    h2: {
        margin: 0,
        padding: 0,
        cursor: 'pointer'
    },
    resultMoreWraper: {
        width: 250,
        height: 55,
        border: '2px solid #E9E9E9',
        backgroundColor: '#FFF',
        textAlign: 'center',
        paddingTop: 5,
        boxSizing: 'border-box',
        verticalAlign: 'top',
        margin: '0 auto',
        '&:hover': {
            boxShadow: '0 2px 12px 0 rgba(0,0,0,.2), 0 1px 4px 0 rgba(0,0,0,.05)'
        }
    },
    finalResultButtonWraper: {
        width: 650,
        height: 55,
        border: '2px solid #E9E9E9',
        backgroundColor: '#FFF',
        textAlign: 'center',
        paddingTop: 5,
        boxSizing: 'border-box',
        verticalAlign: 'top',
        margin: '0 auto',
        '&:hover': {
            boxShadow: '0 2px 12px 0 rgba(0,0,0,.2), 0 1px 4px 0 rgba(0,0,0,.05)'
        }
    },
    resultBox: {
        margin: '40px 0',
        paddingTop: 15,
        //borderTop: '1px solid #CDCDCD'
    },
    table_title: {
        padding: '10px 0 8px 0'
    },
    table: {
        width: '100%',
        overflowX: 'auto',
        borderCollapse: 'collapse'
        //backgroundColor: '#F8F8F8',
    },
    tbody: {
        fontSize: 13,
        borderCollapse: 'collapse'
    },
    pointThead: {
        fontSize: '16px !important',
        borderCollapse: 'collapse',
        backgroundColor: '#efefef',
    },
    thead: {
        fontSize: 16,
        borderBottom: 'solid 2px #C8C8C8',
        borderCollapse: 'collapse'
    },
    tr: {
        height: 40,
        borderLeft: 'none',
        borderRight: 'none'
    },
    trDoc: {
        height: 50,
        borderLeft: 'none',
        borderRight: 'none'
    },
    tdDocTitle: {
        width: '80%',
        paddingLeft: 10
    },
    tdButton: {
        width: '20%',
        textAlign: 'right'
    }
})

