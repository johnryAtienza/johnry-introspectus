import axios from 'axios';

axios.defaults.baseURL = 'https://www.data.act.gov.au';

let actData = {
    getACTData: (param)=> {
        console.info(param)
        return axios.get('/api/id/d56a-2nhi.json', {
            params: param
        });
        
    },
    getACTDataCount: ()=> {
        // console.info(param)
        const param ={
            $query: 'select *, :id order by `date` asc  |> select count(*) as __count_alias__'
        }
        return axios.get('/api/id/d56a-2nhi.json', {
            params: param
        });
        
    },
    getACTbyYear: (y) => {
        const param ={
            $where: 'date between "' + y + '" and "' + (y + 1) + '"',
            $limit: 50000
        }
        console.info(param)
        return axios.get('/api/id/d56a-2nhi.json', {
            params: param
        });
    }
}

export default actData;
