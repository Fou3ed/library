import fs from 'fs'

let DataString = ''

async function writeLOG(eventsData) {
    console.log(eventsData)
    DataString = ''
    //DATE:
    const date = new Date()
    const day = ('0' + date.getDate()).slice(-2)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)
    const DateString = 'Temps: \t' + hours + ':' + minutes + ':' + seconds + '\t' + day + '/' + month + '/' + year
    DataString = DateString
    for (let i = 0; i < eventsData.length; i++) {
        DataString =
            DataString +
            `
_____________________________________________________________________
`
    }

    fs.writeFile('Logs/PerformanceLog.txt', DataString, (err) => {
        if (err) console.log(err)
    })
}

//save log backup by day every 10 minutes
export async function saveLOGHistory() {
    console.log('I STARTED LOGGING')
    setInterval(() => {
        let currentData = DataString
        if (currentData !== '') {
            const date = new Date()
            const day = ('0' + date.getDate()).slice(-2)
            const month = ('0' + (date.getMonth() + 1)).slice(-2)
            const year = date.getFullYear()
            const FileName = `PerformanceLog ${day}-${month}-${year}.txt`
            fs.writeFile(`Logs/${FileName}`, currentData, (err) => {
                if (err) console.log(err)
            })
        }
    }, 600000)
}

saveLOGHistory()

export default writeLOG
