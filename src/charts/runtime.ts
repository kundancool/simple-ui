/**
 * Chart.js runtime, loaded lazily.
 *
 * chart.js and vue-chartjs are optional peers: importing the library must not
 * require them. Chart components therefore reach this module through a dynamic
 * `import()`, so it only loads when a chart actually renders.
 */
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
)

export { Bar, Doughnut, Line }
export type { ChartComponent } from './types'
