import cn from 'classnames';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import { TagCloud } from 'react-tagcloud';
import styles from '../styles/layout.module.scss';
import axios from 'axios';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '../components/Dialog';

/* Icons */
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const ChartNoSSR = dynamic(
  () => import('../components/Chart'),
  { ssr: false }
)

const months = ['2019-01-01','2019-02-01','2019-03-01','2019-04-01','2019-05-01','2019-06-01',
'2019-07-01','2019-08-01','2019-09-01','2019-10-01','2019-11-01','2019-12-01','2020-01-01',
'2020-02-01','2020-03-01','2020-04-01','2020-05-01','2020-06-01','2020-07-01','2020-08-01',
'2020-09-01','2020-10-01','2020-11-01','2020-12-01'];

function capitalize(str) {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
}

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [evaluateText, setEvaluateText] = useState(false);
  const [chartData, setChartData] = useState(false);
  const [sentCloud, setSentCloud] = useState('pos');
  const [lineChart, setLineChart] = useState('avg');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [evaluateResults, setEvaluateResults] = useState({tag: 'neutral', rating: 0});

  useEffect(() => {
    const token_type = localStorage.getItem('token_type');
    const access_token = localStorage.getItem('access_token');
    if (!access_token || !token_type) {
      location.href = '/signin';
    }
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/kmeans/chart_data`, {
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    }).then(({data}) => {
        setChartData(data);
        setLoading(false)
      })
  }, []);

  const handleEvaluate = () => {
    const token_type = localStorage.getItem('token_type');
    const access_token = localStorage.getItem('access_token');
    if (!access_token || !token_type) {
      location.href = '/signin';
    }
    if (!evaluateText) {
      setDialogOpen(true);
      return;
    }
    setEvaluating(true);
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/lexicon/evaluate?query=${evaluateText}`, {
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    }).then(({data}) => {
        setEvaluateResults(data)
        setEvaluating(false);
        setShowResults(true);
      })
  }

  const pieData = chartData ? {
    columns: [
      ['Positivo', chartData.pie.pos],
      ['Negativo', chartData.pie.neg],
    ],
    type : 'pie'
  } : {};

  const posLineData = chartData ? {
    x: 'x', type: "line",
    columns: [
      ['x', ...months],
      ["Positivos", ...chartData.pos_rating.col],
    ],
    colors: {'Positivos': '#2f9e2c'}
  } : {};
  const negsLineData = chartData ? {
    x: 'x', type: "line",
    columns: [
      ['x', ...months],
      ["Negativos", ...chartData.neg_rating.col],
    ],
    colors: {'Negativos': '#bb0f0f'}
  } : {};
  const avgLineData = chartData ? {
    x: 'x', type: "line",
    columns: [
      ['x', ...months],
      ["Avg. Rating", ...chartData.avg_rating.col],
    ],
  } : {};
  const lineChartDict = {
    'pos': {data: posLineData, title: 'Número de tweets positivos'},
    'neg': {data: negsLineData, title: 'Número de tweets negativos'},
    'avg': {data: avgLineData, title: 'Sentimiento a través del tiempo'}
  }
  const cloudData = chartData ? Object.keys(chartData[`${sentCloud}_wordcloud`]).map(k => {
    return { value: capitalize(k), count: chartData[`${sentCloud}_wordcloud`][k]}
  }) : [];
  
  const lineAxis = {
    x: {
      type: 'timeseries',
      tick: {
        values: ['2019-04-01', '2020-01-01', '2020-10-01'],
        format: '%Y-%m'
      }
    }
  }

  const resultsDict = {
    "very_dissatisfied": {face: <SentimentVeryDissatisfiedIcon style={{color: '#bb0f0e'}} />, tag: 'Muy negativo'},
    "dissatisfied": {face: <SentimentDissatisfiedIcon style={{color: '#bb0f0e'}} />, tag: 'Negativo'},
    "neutral": {face: <SentimentNeutralIcon style={{color: '#1f77b4'}} />, tag: 'Neutral'},
    "satisfied": {face: <SentimentSatisfiedAltIcon style={{color: '#2f9f2c'}} />, tag: 'Positivo'},
    "very_satisfied": {face: <SentimentVerySatisfiedIcon style={{color: '#2f9f2c'}} />, tag: 'Muy Positivo'}
  }
  
  return (
    <div className={styles.lexiconLayout}>
      <Dialog
        open={dialogOpen}
        onClose={()=>setDialogOpen(false)}
        message="Por favor escribe una frase."
      />
      <Box className={styles.left} sx={{paddingTop: 2}}>
        <h1 style={{paddingLeft: 20, margin: '20px 0 0'}}>Lexicon</h1>
        <p style={{padding: '0 20px', marginBottom: 0}}>En esta página se muestran los resultados obtenidos haciendo uso de una adaptación de la herramienta vaderSentiment.</p>
        <p style={{padding: '0 20px'}}>
          Los resultados obtenidos fueron los siguientes
          <ul>
            <li>
              <b>Positivos:</b><br />
              Precision: {chartData && chartData.metrics ? chartData.metrics.pos.precision.toFixed(4) : '-'}<br />
              Recall: {chartData && chartData.metrics ? chartData.metrics.pos.recall.toFixed(4) : '-'}<br />
              F1-score: {chartData && chartData.metrics ? chartData.metrics.pos.f1.toFixed(4) : '-'}<br />
            </li>
            <li>
            <b>Negativos:</b><br />
              Precision: {chartData && chartData.metrics ? chartData.metrics.neg.precision.toFixed(4) : '-'}<br />
              Recall: {chartData && chartData.metrics ? chartData.metrics.neg.recall.toFixed(4) : '-'}<br />
              F1-score: {chartData && chartData.metrics ? chartData.metrics.neg.f1.toFixed(4) : '-'}<br />
            </li>
          </ul>
          
        </p>
        <Box mb={4} />
        <h2 className={styles.sectionTitle} style={{marginBottom: 12}}>Evalúa una frase</h2>
        <Box
          sx={{
            padding: '0 30px 0',
            width: '100%',
          }}
        >
          <TextField
            id="outlined-multiline-flexible"
            multiline
            rows={6}
            fullWidth
            placeholder='Escribe una frase aquí para evaluarla'
            onChange={(event) => {
              setShowResults(false);
              setEvaluateText(event.target.value);
            }}
            disabled={evaluating}
          />
          {
            showResults ? (
              <div>
                <h3>Resultado</h3>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <Box sx={{display: 'flex'}}>
                    {resultsDict[evaluateResults.tag].face}
                    <Box sx={{paddingLeft: 1, display: 'inline'}}>{resultsDict[evaluateResults.tag].tag}</Box>
                  </Box>
                  <Box sx={{display: 'flex'}}>
                    Puntaje:
                    <Box sx={{paddingLeft: 1, display: 'inline'}}>{evaluateResults.rating}</Box>
                  </Box>
                </Box>
              </div>
            ) : null
          }
          <Box sx={{paddingTop: 2}}>
            <Button onClick={handleEvaluate} disabled={evaluating} variant='contained'>{evaluating ? 'Evaluando...' : 'Evaluar'}</Button>
          </Box>
        </Box>
      </Box>
      <div className={styles.right}>
        {
          chartData ? (
            <>
              <div className={cn(styles.chartContainer, styles.linesChartContainer)}>
                <h2 className={styles.sectionTitle}>{lineChartDict[lineChart].title}</h2>
                <div className={styles.selectContainer}>
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={lineChart}
                      onChange={(event) => {
                        setLoading(true);
                        setTimeout(() => {
                          setLineChart(event.target.value);
                          setLoading(false);
                        });
                      }}
                    >
                      <MenuItem value="pos"># Positivos</MenuItem>
                      <MenuItem value="neg"># Negativos</MenuItem>
                      <MenuItem value="avg">Avg. Rating</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {
                  loading ? (<span>Loagin...</span>) : (
                    <ChartNoSSR
                      id={lineChart}
                      chartProps={{data: lineChartDict[lineChart].data, axis: lineAxis}}
                    />
                  )
                }
              </div>
              <div className={cn(styles.chartContainer, styles.pieChartContainer)}>
                <h2 className={styles.sectionTitle}>Sentimiento</h2>
                <ChartNoSSR
                  id="pie"
                  chartProps={{data: pieData}}
                />
              </div>
              <div className={cn(styles.chartContainer, styles.wordCloudChartContainer)}>
                <h2 className={styles.sectionTitle}>Nube de etiquetas</h2>
                <Box pb={4} />
                <div className={styles.selectContainer}>
                  <FormControl fullWidth>
                    <Select
                      labelId="cloud-select-label"
                      id="cloud-select"
                      value={sentCloud}
                      onChange={(event) => {
                        //setLoading(true);
                        setTimeout(() => {
                          setSentCloud(event.target.value);
                          //setLoading(false);
                        });
                      }}
                    >
                      <MenuItem value="pos">Positivos</MenuItem>
                      <MenuItem value="neg">Negativos</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <TagCloud
                  minSize={12}
                  maxSize={35}
                  tags={cloudData}
                  randomColor={{
                    luminosity: 'dark',
                    format: 'rgba',
                    alpha: 0.5
                }}
                  onClick={tag => console.log(`'${tag.value}' was selected!`)}
                />
              </div>
            </>
          ) : null
        }
      </div>
    </div>
  );
}
