import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import {
  Card,
  Dimmer,
  Loader,
  Select
} from 'semantic-ui-react';
import './App.css'

function App() {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currency, setCurrency] = useState('USD')
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState(null);

  const options = [
    { value: 'USD', text: 'USD' },
    { value: 'EUR', text: 'EUR' },
    { value: 'GBP', text: 'GBP' }
  ];

  useEffect(() => {
    
    async function fetchPrices() {
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const data = await res.json();
      setPriceData(data.bpi);
      getChartData('USD');
     
  }
    fetchPrices();
  }, []);

  const getChartData = async (curr) => {
    const res = await fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${curr}&start=2013-09-01&end=2013-09-10`)
    const data = await res.json();
    const categories = Object.keys(data.bpi);
    const series = Object.values(data.bpi);
    setChartData({
      xaxis: {
        categories: categories
      }
    })
    setSeries([
      {
        name: "Bitcoin Price",
        data: series
      }
    ])
    setLoading(false);
  }

  const handleSelect = (e, data) => {
    
    setCurrency(data.value)
    getChartData(data.value) 
      
  };

  return (
    <div className='App'>
      
      {loading ? (
        <div>
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
          <>
            <div className="price-container"
              style={{
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                width: 600,
                height: 300,
                margin: '0 auto'
              }}>
              <div className='form'>
                <h3>1 BitCoin Equals</h3>
                <Select placeholder='Select your currency' onChange={handleSelect} options={options} />
              </div>
              <div className='price'>
                <Card>
                  <Card.Content>
                    <Card.Header>{currency} Price</Card.Header>
                    <Card.Description>{priceData[currency].rate} {' '} {priceData[currency].description}</Card.Description>
                  </Card.Content>
                </Card>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Chart
                options={chartData}
                series={series}
                type="line"
                width="1200"
                height="300"
              />
            </div>
          </>
        )}
    </div>
  );
}

export default App;