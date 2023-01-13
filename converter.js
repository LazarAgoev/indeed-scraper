import fs from "fs"







export async function convert(data_origin){
    
    data_origin = location(data_origin);
    data_origin = job_type(data_origin)
    data_origin = date(data_origin);
    data_origin = salary(data_origin);
    data_origin = education(data_origin);
    data_origin = benefits(data_origin);

    
    //data_origin.job_description = null;
    //data_origin.inventory.searchOrigin = null;
    return data_origin

}
function benefits(data){
    let arr = data.compensation.benefits.other
    if(arr.includes('401(k)')){
        arr.splice(arr.indexOf('401(k)'),1);
        data.compensation.benefits._401K = 1;
    }
    if(arr.includes('401(k) matching')){
        arr.splice(arr.indexOf('401(k) matching'),1);
        data.compensation.benefits._401K_matching = 1;
    }
    if(arr.includes('Paid time off')){
        arr.splice(arr.indexOf('Paid time off'),1);
        data.compensation.benefits.PTO = 1;
    }
    if(arr.includes('Health insurance')){
        arr.splice(arr.indexOf('Health insurance'),1);
        data.compensation.benefits.insurance.health = 1;
    }
    if(arr.includes('Dental insurance')){
        arr.splice(arr.indexOf('Dental insurance'),1);
        data.compensation.benefits.insurance.dental = 1;
    }
    if(arr.includes('Vision insurance')){
        arr.splice(arr.indexOf('Vision insurance'),1);
        data.compensation.benefits.insurance.vision = 1;
    }
    if(arr.includes('Life insurance')){
        arr.splice(arr.indexOf('Life insurance'),1);
        data.compensation.benefits.insurance.life = 1;
    }

    return data;

}
function education(data){
    let arr = data.skills
    for(let i = 0; i< arr.length; i++){
            if(arr[i].includes('High school')){
                data.education_req.degree = arr[i];
                arr.splice(i,1);
            }
            if(arr[i].includes('Bachelor')){
                data.education_req.degree = arr[i];
                arr.splice(i,1);
            }
            if(arr[i].includes('Doctor')){
                data.education_req.degree = arr[i];
                arr.splice(i,1);
            }

    }

    return data;
}

function salary(data){
    if(data.compensation.salary.length === 0){
        data.compensation.salary = {
            min: null,
            max: null,
            interval: null,
        }
        return data;
    }
    let str = data.compensation.salary[0].toLowerCase()
    if(str === 'not provided by employer'){
        data.compensation.salary = {
            min: null,
            max: null,
            interval: null,
        }
        return data;
    }
    str = str.split(' ');
    if(str[0]=== 'from'){
        let num = str[1];
        num = num.replace('$', '');
        num = num.replace(',', '');

        if(str[str.length - 1]==='year'){
            data.compensation.salary = {
                min: parseInt(num),
                max: null,
                interval: 'year',
            }
        }
        else if(str[str.length - 1]==='week'){
            data.compensation.salary = {
                min: parseInt(num),
                max: null,
                interval: 'week',
            }
        }
        else if(str[str.length - 1]==='month'){
            data.compensation.salary = {
                min: parseInt(num),
                max: null,
                interval: 'month',
            }
        }
        else if(str[str.length - 1]==='hour'){
            data.compensation.salary = {
                min: parseFloat(num),
                max: null,
                interval: 'hour',
            }
        }
        return data;

    }
    if(str[0]=== 'up'){
        let num = str[2];
        num = num.replace('$', '');
        num = num.replace(',', '');

        if(str[str.length - 1]==='year'){
            data.compensation.salary = {
                min: null,
                max: parseInt(num),
                interval: 'year',
            }
        }
        else if(str[str.length - 1]==='week'){
            data.compensation.salary = {
                min: null,
                max: parseInt(num),
                interval: 'week',
            }
        }
        else if(str[str.length - 1]==='month'){
            data.compensation.salary = {
                min: null,
                max: parseInt(num),
                interval: 'month',
            }
        }
        else if(str[str.length - 1]==='hour'){
            data.compensation.salary = {
                min: null,
                max: parseFloat(num),
                interval: 'hour',
            }
        }
        return data;

    }
    if(str[1]==='-'){
        let left_num = str[0];
        let right_num = str[2];
        left_num = left_num.replace('$', '');
        left_num = left_num.replace(',', '');
        right_num = right_num.replace('$', '');
        right_num = right_num.replace(',', '');

        if(str[str.length - 1]==='year'){
            data.compensation.salary = {
                min: parseInt(left_num),
                max: parseInt(right_num),
                interval: 'year',
            }
        }
        else if(str[str.length - 1]==='week'){
            data.compensation.salary = {
                min: parseInt(left_num),
                max: parseInt(right_num),
                interval: 'week',
            }
        }
        else if(str[str.length - 1]==='month'){
            data.compensation.salary = {
                min: parseInt(left_num),
                max: parseInt(right_num),
                interval: 'month',
            }
        }
        else if(str[str.length - 1]==='hour'){
            data.compensation.salary = {
                min: parseFloat(left_num),
                max: parseFloat(right_num),
                interval: 'hour',
            }
        }
        return data;
    }

    
    let num = str[0];
    num = num.replace('$', '');
    num = num.replace(',', '');

    if(str[str.length - 1]==='year'){
        data.compensation.salary = {
            min: parseInt(num),
            max: parseInt(num),
            interval: 'year',
        }
    }
    else if(str[str.length - 1]==='week'){
        data.compensation.salary = {
            min: parseInt(num),
            max: parseInt(num),
            interval: 'week',
        }
    }
    else if(str[str.length - 1]==='month'){
        data.compensation.salary = {
            min: parseInt(num),
            max: parseInt(num),
            interval: 'month',
        }
    }
    else if(str[str.length - 1]==='hour'){
        data.compensation.salary = {
            min: parseFloat(num),
            max: parseFloat(num),
            interval: 'hour',
        }
    }
    return data;


}
function date(data){
    let today = new Date();
    if(data.inventory.posted === null){
        return data;
    }
    let str = data.inventory.posted.toLowerCase()
    if(str==="posted today"){
        data.inventory.posted = today;
        return data;
    }
    str = str.split(' ');
    str = str[1];
    if(str[str.length-1] === '+'){
        data.inventory.posted = null;
        return data;
    }
    str = parseInt(str);
    today.setDate(today.getDate() - 12);
    data.inventory.posted = today;
    return data;
}
function job_type(data){

    for(let i=0; i<data.job_type.length; i++){
        if(data.job_type[i].toLowerCase()=== 'remote'){
            data.remote = "remote";
            data.job_type.splice(i,1);
        }
        else{
            data.job_type[i] = data.job_type[i].toLowerCase();
        }
    }
    return data;


}

function location(data_origin){
    let location = data_origin.job_info.locations[0]
    let remote = data_origin.job_info.locations[1].toLowerCase();
    
    if(location.toLowerCase()==='remote'){
        data_origin.remote = "remote";
        data_origin.job_info.locations = null;
        return data_origin;

    }



    location = location.split(', ')
    data_origin.job_info.locations = [{
        street: null,
        city: null,
        state: null, 
        zip: null,
        country: "United States"
        
    }]

    if(remote==='remote'){
        data_origin.remote = remote;
    } else if(remote==='hybrid remote'){
        data_origin.remote = remote;
    }

    if(location[0]==='United States'){
        return data_origin
    }

    



    data_origin.job_info.locations[0].city = location[0]
    if(location.length != 1 ){

        let state = location[1].split(' ')
        data_origin.job_info.locations[0].state = state[0]
        if(state.length != 1 ){
            data_origin.job_info.locations[0].zip = state[1]
        }
    }
    return data_origin

}

export default convert

