import dayjs from 'dayjs'
import 'dayjs/locale/th'         // โหลด locale ภาษาไทย
import buddhistEra from 'dayjs/plugin/buddhistEra' // plugin พ.ศ.

dayjs.extend(buddhistEra)
dayjs.locale('th')

export default dayjs;
