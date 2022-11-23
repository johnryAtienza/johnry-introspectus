import React from 'react'
import {
    CCard,
    CCardBody,
    CCardGroup,
    CCardHeader,
    CCol,
    CLink,
    CRow,
    CWidgetStatsB,
    CWidgetStatsC,
    CWidgetStatsE,
    CWidgetStatsF,
    CInputGroup,
    CFormInput,
    CButton,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CDropdownDivider
  } from '@coreui/react'
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
    CChartPolarArea,
    CChartRadar,
  } from '@coreui/react-chartjs'
import _ from 'lodash'
import CIcon from '@coreui/icons-react'
import { cilList, cilShieldAlt, cilSearch } from '@coreui/icons';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import LoadingOverlay from "react-loading-overlay"
LoadingOverlay.propTypes = undefined
import Datas from '../../api/data'
import { format } from "date-fns";

const Dashboard = () => {
    const [actData, setACTData] = React.useState([])
    const [actDataRaw, setACTDataRaw] = React.useState([])
    const [actDataYr, setACTDataYr] = React.useState([])
    const [actDataDay, setACTDataDay] = React.useState([])
    const [actDataDates, setActDataDates] = React.useState([])
    const [actDataValueDates, setActDataValueDates] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [searchString, setSearchString] = React.useState('')
    const [totalCount, setTotalCount] = React.useState(0)
    const [selectedYear, setSelectedYear] = React.useState(2022)
    const [selectedMonth, setSelectedMonth] = React.useState(null)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const columns = [{
        dataField: 'date',
        text: 'Date',
        sort: true,
        formatter: (cell) => {
            let dateObj = cell;
            if (typeof cell !== 'object' && cell != undefined) {
                // console.info(cell)
                dateObj = new Date(cell);
                // console.info(dateObj)
                return format((new Date(dateObj)), "MMMM dd, yyyy");
            }
            return 'No Date'
            // return `${('0' + dateObj.getUTCDate()).slice(-2)}/${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${dateObj.getUTCFullYear()}`
        },
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'timeatsiteinhours',
        text: 'Time at site in hours',
        sort: true,
          headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'description_of_site',
        text: 'Description',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'camera_location',
        text: 'Camera Location',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'street',
        text: 'Street',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'number_checked',
        text: 'Number Checked',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'highest_speed',
        text: 'Highest Speed',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'average_speed',
        text: 'Average Speed',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
        }, {
        dataField: 'posted_speed',
        text: 'Posted Speed',
        sort: true,
        headerStyle: { backgroundColor: '#eee' }
    }];

    const pagination = paginationFactory({
        page: 2,
      });

    const onTableChange = (type, newState) => {
        // handle any data change here
        // retrieveData();
        // console.info(type, newState)
        retrieveData(newState);
    }

    const retrieveData = (o = {}) => {

        let params = {
            // $limit: 10,
            $offset: 0,
            $order: 'date desc'
        }

        if (o.sortField && o.sortOrder) {
            params.$order = o.sortField + " " + o.sortOrder
        }

        if (searchString) {
            params.$q = searchString
        }

        setIsLoading(true)
        Datas.getACTData(params).then(
            r => {
                // console.info(r)
                setACTData(r.data)
                setIsLoading(false)
            },
            e => {
                console.error(e)
                setIsLoading(false)
            }
        )
        // Datas.getACTDataCount().then(
        //     r => {
        //         console.info(r.data)
        //         setTotalCount(r.data[0])
        //     },
        //     e => {
        //         console.error(e)
        //     }
        // )
    }

    const retrieveDataByYr = () => {
        console.info(selectedYear)
        Datas.getACTbyYear(selectedYear).then(
            r => {
                // console.info(r)

                let om = {};
                r.data.map(row => {
                    if (row.date) {
                        // Per Month
                        const m = row.date.split("-")[1];
                        // console.info(m, row.posted_speed)
                        if (om.hasOwnProperty(m)) {
                            om[m] = om[m] < parseInt(row.posted_speed) ? parseInt(row.posted_speed) : om[m];
                        } else {
                            om[m] = parseInt(row.posted_speed);
                        }

                        // Per Day

                    }
                });
                let dm = [];
                months.map(r => {
                    if (om.hasOwnProperty(r)) {
                        dm.push(om[r]);
                    } else {
                        dm.push(0);
                    }
                })
                setACTDataYr(dm)
                console.info(om);
                setACTDataRaw(r.data)
            },
            e => {
                console.error(e)
            }
        )
    }
    
    const dayPerMonth = () => {
        const lastDayOfTheMonth = lastday(selectedYear, selectedMonth);
        console.info(selectedMonth, lastDayOfTheMonth)
        let om = {};
        actDataRaw.map(row => {
            if (row.date) {
                const d = parseInt(row.date.split("T")[0].split("-")[2]);
                const m = parseInt(row.date.split("-")[1]);
                // should be same month
                if ((m-1) == selectedMonth) {
                    // console.info(m, row.posted_speed)
                    if (om.hasOwnProperty(d)) {
                        om[d] = om[d] < parseInt(row.posted_speed) ? parseInt(row.posted_speed) : om[d];
                    } else {
                        om[d] = parseInt(row.posted_speed);
                    }
                }
                
            }
            
        })

        let dm = [];
        let ds = []
        for (let i = 0; i <= lastDayOfTheMonth; i++) {
            if (om.hasOwnProperty(i)) {
                dm.push(om[i]);
            } else {
                dm.push(0);
            }
            ds.push(i)
        }
        console.info(om)
        console.info(ds, dm)
        setActDataDates(ds);
        setActDataValueDates(dm);
    }

    const lastday = function(y,m){
        return  new Date(y, m +1, 0).getDate();
        }

    const noDataIndication = () => {
        return "No data found"
    }

    React.useEffect(() => {
    retrieveData();
    }, [])

    React.useEffect(() => {
        console.info("YR")
        retrieveDataByYr();
        setACTDataYr([])
        setACTDataDay([])
        setSelectedMonth(null)
        setActDataDates([]);
        setActDataValueDates([]);
    }, [selectedYear])

    React.useEffect(() => {
        console.info("Month")
        if (selectedMonth != null) {
            console.info(selectedMonth)
            dayPerMonth();
        }
        
    }, [selectedMonth])

    const onSearch = (e) => {
        // console.info(e.keyCode)
        setSearchString(e.target.value)
        if (e.keyCode === 13) {
            // console.info(e.target.value)
            retrieveData();
        }
        
    }

    const itemList = () => {
        const currentYr = new Date().getFullYear();
        let row = [];
        for (let i = 2016; i <= currentYr; i++) {
            row.push(i);
        };
        return row.reverse();
    }
  return (
    <>
    <CRow className='selection-box'>
        <CCol xs={6}>
            <CDropdown>
            <CDropdownToggle color="primary">Year: {selectedYear}</CDropdownToggle>
            <CDropdownMenu>
                {itemList().map(r => (
                    <CDropdownItem key={r} onClick={() => setSelectedYear(r)}>{r}</CDropdownItem>
                ))}
                
            </CDropdownMenu>
            </CDropdown>
        </CCol>
        <CCol xs={6}>
            <CDropdown>
            <CDropdownToggle color="primary">Month: {monthsName[selectedMonth] || '--'}</CDropdownToggle>
            <CDropdownMenu>
                {monthsName.map((r, i) => (
                    <CDropdownItem key={r} onClick={() => setSelectedMonth(i)}>{r}</CDropdownItem>
                ))}
                
            </CDropdownMenu>
            </CDropdown>
        </CCol>
    </CRow>
    <CRow>
        <CCol xs={6}>
            <CCard className="mb-4">
            <CCardHeader>Posted Speed by Year</CCardHeader>
            <CCardBody>
                <CChartBar
                data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                    {
                        label: 'Highest posted speed per month the year',
                        backgroundColor: '#00afff',
                        data: actDataYr,
                    },
                    ],
                }}
                labels="months"
                />
            </CCardBody>
            </CCard>
        </CCol>

        <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Posted Speed by Month</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: actDataDates,
                datasets: [
                  {
                    label: 'Posted Speed per day',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: actDataValueDates,
                  },
                //   {
                //     label: 'My Second dataset',
                //     backgroundColor: 'rgba(151, 187, 205, 0.2)',
                //     borderColor: 'rgba(151, 187, 205, 1)',
                //     pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                //     pointBorderColor: '#fff',
                //     data: [random(), random(), random(), random(), random(), random(), random()],
                //   },
                ],
              }}
            />
          </CCardBody>
        </CCard>
        </CCol>
    </CRow>
    <CRow>
        <CCol   >
        <CCard className="mb-4">
            <CCardHeader>Mobile Speed Camera Visits and Stays</CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol sm={5}>
                    <CInputGroup className="mb-3">
                    <CFormInput placeholder="Search" aria-label="Search" aria-describedby="button-addon2" onKeyUp={e => onSearch(e)} onBlur={e => {if (!searchString) { retrieveData()}}}/>
                    <CButton type="button" color="secondary" variant="outline" id="button-addon2" onClick={() => retrieveData()}>
                        <CIcon icon={cilSearch} size='sm'/>
                    </CButton>
                    </CInputGroup>
                    
                    </CCol>
                </CRow>
                <BootstrapTable 
                keyField='number_checked' 
                data={ actData } 
                columns={ columns } 
                loading={ isLoading }
                overlay={ overlayFactory({ spinner: true, fadeSpeed: 2000, styles: { overlay: (base) => ({...base, background: 'rgba(0, 0, 0, 0.2)'}) } }) }
                remote={ {
                    filter: true,
                    sort: true,
                    cellEdit: false
                } }
                pagination={ paginationFactory() }
                //   bordered={ false }
                noDataIndication={noDataIndication}
                onTableChange={ onTableChange }
                />
                
            </CCardBody>
        </CCard>
        </CCol>
    </CRow>
    </>
  )
}

export default Dashboard