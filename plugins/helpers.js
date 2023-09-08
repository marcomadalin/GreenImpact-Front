export default ({ app, $auth }, inject) => {
  inject('getAllowedLanguages', () => ['es'])
  inject('getAllAllowedLanguages', () => {
    if ($auth.user) {
      return JSON.parse($auth.user.sustainable_entity.allowed_languages)
    }
  })
  inject('graphGetData', (rawMetrics, indicador) =>
    graphGetData(rawMetrics, indicador)
  )
  inject('pieGetData', (rawMetrics) => pieGetData(rawMetrics, app.i18n))
  inject('pieGetDataQualitative', (rawMetrics, qualitativeTypes) =>
    pieGetDataQualitative(rawMetrics, qualitativeTypes, app.i18n)
  )
  inject('graphGetVisualMap', (spaceData, type, legend) =>
    graphGetVisualMap(spaceData, type, legend)
  )
  inject('graphGetDateFormat', (date, fullDate, separator) =>
    graphGetDateFormat(date, fullDate, separator, app.$moment)
  )
  inject('graphTitlePlaceholder', () => graphTitlePlaceholder())
  inject('graphTooltipFormat', (param, fullDate, unit) =>
    graphTooltipFormat(param, fullDate, unit, app.$moment, app.i18n)
  )
  inject('graphTooltipFormatMilestone', (param, fullDate, unit) =>
    graphTooltipFormatMilestone(param, fullDate, unit, app.$moment, app.i18n)
  )

  inject('getTrend', (rawMetrics, metricType, sample) =>
    getTrend(rawMetrics, metricType, sample)
  )
  inject('roundLocale', (value, maxDigits) => roundLocale(value, maxDigits))
  inject('truncate', (text, length, suffix) => truncate(text, length, suffix))
  inject('truncateText', (text, length, suffix) =>
    truncateText(text, length, suffix)
  )
  inject('graphObjectivesMark', (objectives, minDate, maxDate) =>
    graphObjectivesMark(objectives, minDate, maxDate, 'es', app.$moment)
  )

  inject('htmlToText', (html) => htmlToText(html))
  inject('getImageRnd', (uri) => getImageRnd(uri))
  inject('newRatio', (oldValue, oldMin, oldMax, newMin, newMax) =>
    newRatio(oldValue, oldMin, oldMax, newMin, newMax)
  )

  inject('parseDate', (date) => parseDate(date))
}

function htmlToText(html) {
  return html.replace(/<[^>]*>?/gm, '')
}

function getImageRnd(uri) {
  const cacheKey = +new Date()
  return (uri += '?rnd=' + cacheKey)
}

function pieGetData(rawMetrics, i18n) {
  // console.time('temperatureTime')
  if (rawMetrics.length) {
    let goodDay = 0
    let badDay = 0
    rawMetrics.forEach((metric, key) => {
      const status = metric.status
      let score = metric.value
      if (score === undefined || score === null) {
        score = '-'
      }
      if (score !== '-') {
        switch (status) {
          case 'good': {
            goodDay++
            break
          }
          case 'bad': {
            badDay++
            break
          }
        }
      }
    })
    // console.timeEnd('temperatureTime')
    return [
      {
        name: i18n.t('milestonesAchieved'),
        value: goodDay,
        itemStyle: { color: '#389201' },
      },
      {
        name: i18n.t('milestonesNotAchieved'),
        value: badDay,
        itemStyle: { color: '#EB1C2D' },
      },
    ]
  }
  return []
}

function pieGetDataQualitative(rawMetrics, qualitativeTypes, i18n) {
  // console.time('temperatureTime')
  if (rawMetrics.length) {
    let goodDay = 0
    let badDay = 0
    const good = qualitativeTypes.find(
      (qualitativeType) => qualitativeType.value === 1
    )
    const bad = qualitativeTypes.find(
      (qualitativeType) => qualitativeType.value === 0
    )
    rawMetrics.forEach((metric, key) => {
      if (metric.value === good.value) {
        goodDay++
      } else {
        badDay++
      }
    })
    // console.timeEnd('temperatureTime')
    return [
      {
        value: goodDay,
        itemStyle: { color: '#' + good.color },
      },
      {
        value: badDay,
        itemStyle: { color: '#' + bad.color },
      },
    ]
  }
  return []
}

function graphGetData(rawMetrics, indicator) {
  if (rawMetrics.length) {
    let type = ''
    const data = rawMetrics.flatMap((metric, key) => {
      let color = '#C4C4C4'
      const status = metric.status
      type = metric.sampleType
      let score

      score = metric.trend
      if (score === undefined || score === null) {
        score = ''
      }
      switch (status) {
        case 'GREEN': {
          color = '#389201'
          break
        }
        case 'YELLOW': {
          color = '#FCC30B'
          break
        }
        case 'RED': {
          color = '#EB1C2D'
          break
        }
      }
      /* prediccion
      if (metric.today) {
        return [
          {
            value: [metric.date, parseFloat(metric.value), score, metric.today],
            symbolSize: 14,
            itemStyle: { color, borderType: 'dotted' },
          },
        ]
      } else {
        */
      if (type === 'QUALITATIVE') {
        let weight
        indicator.indicatorDTO.qualitativeTypeDTO.weightedValues.forEach(
          (value) => {
            if (value.label === metric.qualitativeValue) {
              weight = value.weight
            }
          }
        )
        return [
          {
            value: [metric.sampleDate, parseFloat(weight), score, false],
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: { color, borderType: 'solid' },
          },
        ]
      } else if (type === 'QUANTITATIVE_DIMENSIONAL') {
        return [
          {
            value: [
              metric.sampleDate,
              parseFloat(metric.quantitativeValue),
              score,
              false,
            ],
            dimension: metric.quantitativeDimensionOrder,
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: { color, borderType: 'solid' },
          },
        ]
      }
      return [
        {
          value: [
            metric.sampleDate,
            parseFloat(metric.quantitativeValue),
            score,
            false,
          ],
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: { color, borderType: 'solid' },
        },
      ]
      // }
    })
    // console.timeEnd('temperatureTime')
    return data
  }
  return []
}

function graphGetDateFormat(date, fullDate, separator, moment) {
  let formattedDate
  if (fullDate) {
    formattedDate = moment.utc(date).local().format('DD-MM-YYYY')
  } else {
    formattedDate = moment.utc(date).local().format('HH:mm')
  }
  return formattedDate
}

function graphTooltipFormat(param, fullDate, unit, moment, i18n) {
  const label = graphGetDateFormat(
    param[0].data.value[0],
    fullDate,
    false,
    moment
  )
  const avg = param[0].data.value[1].toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })
  const score = param[0].data.value[2]
  const today = param[0].data.value[3]

  let icon = 'east'
  switch (score) {
    case 'IMPROVING':
      icon = 'north_east'
      break
    case 'FLAT':
      icon = 'east'
      break
    case 'NOT_IMPROVING':
      icon = 'south_east'
      break
    case '':
      break
  }
  return [
    today
      ? '<span style="font-size: 14px; font-weight: bold;">' +
        i18n.t('todaysProjection') +
        '</span><br/>'
      : '',
    label + '<br/>',
    '<span style="font-size:12px; background-color: ' +
      param[0].data.itemStyle.color +
      '" class="rounded-circle mr-2">&nbsp;&nbsp;&nbsp;&nbsp;</span>',
    i18n.t('sampleValue') + ': ' + avg + ' ' + unit + '<br/>',
    '<v-avatar size:12px color="darkBlue">' +
      '<v-icon color="white" size="9px" v-text=' +
      icon +
      '></v-icon></v-avatar>' +
      i18n.t('trend') +
      ': ' +
      score +
      '<br/>',
  ].join('')
}

function graphTooltipFormatMilestone(param, fullDate, unit, moment, i18n) {
  const label = graphGetDateFormat(
    param[0].data.value[0],
    fullDate,
    false,
    moment
  )
  const avg = param[0].data.value[1].toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })
  return [
    label + '<br/>',
    '<span style="font-size:12px; background-color: ' +
      param[0].data.itemStyle.color +
      '" class="rounded-circle mr-2">&nbsp;&nbsp;&nbsp;&nbsp;</span>',
    i18n.t('sampleValue') + ': ' + avg + ' ' + unit + '<br/>',
  ].join('')
}

function randomRgba() {
  const o = Math.round
  const r = Math.random
  const s = 255
  return (
    'rgba(' +
    255 +
    ',' +
    (o(50 + r() * s) % s) +
    ',' +
    (o(50 + r() * s) % s) +
    ', 0.2)'
  )
}
function graphObjectivesMark(objectives, minDate, maxDate, locale, moment) {
  const data = objectives.map((objective, key) => {
    let initialDate = moment.utc(objective.startDate).local().toISOString()
    let finalDate = moment.utc(objective.endDate).local().toISOString()

    if (minDate > initialDate && initialDate < maxDate) {
      initialDate = minDate
      if (maxDate < finalDate) {
        finalDate = maxDate
      }
    }
    let color
    if (key > 0 && objectives.length > 1) {
      color = randomRgba()
    } else {
      color = { opacity: 0.15 }
    }
    return [
      {
        itemStyle: color,
        name: 'sdnjhvbsdiuovn',
        xAxis: initialDate,
      },
      {
        xAxis: finalDate,
      },
    ]
  })
  return {
    label: {
      distance: 20,
      fontSize: 14,
      color: '#525252',
      width: 100,
      overflow: 'truncate',
    },
    data,
  }
}

function graphTitlePlaceholder() {
  return {
    title: {
      show: true,
      text: 'No data',
      left: 'center',
      top: 'center',
      textStyle: {
        color: 'grey',
        fontSize: 25,
      },
    },
  }
}

function graphGetVisualMap(threshold, type) {
  const visualMapData = {
    type: 'piecewise',
    show: false,
    outOfRange: {
      color: '#C10000',
    },
    pieces: null,
  }
  visualMapData.pieces = threshold.metric.flatMap((metricData) => {
    // Eliminar
    if (metricData.metric === type) {
      return [
        {
          gte: metricData.min,
          lt: metricData.max,
          color: '#' + metricData.color,
        },
      ]
    }
    return []
  })
  return visualMapData
}

function getTrend(rawMetrics, metricType, sample = 20) {
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumXX = 0
  let count = 0
  let x = 0
  let y = 0
  rawMetrics = rawMetrics.slice(-sample)
  const valuesLength = rawMetrics.length

  if (valuesLength === 0) {
    return null
  }
  for (let v = 0; v < valuesLength; v++) {
    x = v
    y = rawMetrics[v][metricType]
    sumX += x
    sumY += y
    sumXX += x * x
    sumXY += x * y
    count++
  }
  const m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX)

  return m
}

function roundLocale(value, maxDigits = 1) {
  if (value !== null || value !== undefined) {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: maxDigits,
    })
  } else {
    return null
  }
}

function truncate(text, length, suffix) {
  const doc = new DOMParser().parseFromString(text, 'text/html')
  const textLength = (doc.body.textContent || '').length
  const diff = text.length - textLength
  if (textLength > length + diff) {
    return text.substring(0, length + diff) + suffix
  } else {
    return text
  }
}

function truncateText(text, length, suffix) {
  if (!text) {
    return
  }
  if (length < text.length) {
    return text.substring(0, length) + suffix
  } else {
    return text
  }
}

function parseDate(date) {
  if (!date) return null

  const [month, day, year] = date.split('-')
  return `${year}-${month}-${day}`
}

function newRatio(oldValue, oldMin, oldMax, newMin, newMax) {
  return ((oldValue - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin
}
