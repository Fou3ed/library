import appActions from '../models//app/appMethods.js'


const foued = new appActions()

const check = async function (data) {
    const res = foued.getAppById(data)
    return res
}
export default check  