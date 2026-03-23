
//import { Padding } from '@mui/icons-material';
import { defaultThemes } from 'react-data-table-component';


const customStyles = {

    header: {
        style: {
            minHeight: '300px',
        },
    },

    rows: {
        style: {

           // backgroundColor: '#4c4c4d', // Cambia '#ffcc80' al color que desees

        },
    },

    headRow: {
        style: {

            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: 'gray',// defaultThemes.default.divider.default,
            borderBottomStyle: 'solid',
            borderBottomWidth: '3px',
            //borderBottomColor: 'gray', // defaultThemes.default.divider.default,
            // marginLeft: '-5px',
            //backgroundColor: '#515152',


            //minHeight: '40px',



        },
    },
    headCells: {
        style: {

            borderRightStyle: 'solid',
            borderRightWidth: '2px',
           // borderRightColor: 'gray',// defaultThemes.default.divider.default,
            //backgroundColor: '#515152',

            fontFamily: 'Asap Condensed',

            fontSize: '16px',
            //color: '#00cccc',
            // marginLeft: '5px',
            marginRight: '3px',
            //overflowWrap: 'break-word',
            // minHeight: '60px',
           // maxHeight: '100px',
            //maxWidth: '300px',
            //wordWrap: 'break-word',




        },
    },
    cells: {
        style: {

            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: defaultThemes.default.divider.default,

            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomColor: defaultThemes.default.divider.default,

            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: defaultThemes.default.divider.default,
            fontFamily: 'Asap Condensed',
            fontSize: '16px',
            //color: '#dbdbdb',//'#89eaf5',
            marginRight: '3px',
            //backgroundColor: '#455573',
            PaddingRight: '1px',

        },
    },
};


export default customStyles;