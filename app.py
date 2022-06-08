from flask import *
import csv
import datetime as dt

app = Flask(__name__)


def getProvDate(prov,date):
    with open('.\static\innerData\province_AQI_IAQI\day\\'+date+'00.csv', encoding= 'utf-8') as f:
        f_csv = csv.DictReader(f)
        for row in f_csv:
            if row['province'] == prov:

                return(row['AQI'])
def getCityDate(city,date):
    with open('.\static\innerData\city_AQI_IAQI\day\\'+date+'00.csv', encoding= 'utf-8') as f:
        f_csv = csv.DictReader(f)
        for row in f_csv:
            if row['city'] == city:
                return(row['AQI'])
def getProv(prov):
    i = 0
    aqi = []
    pm2_5 = []
    pm10 = []
    so2 = []
    no2 = []
    co = []
    o3 =[]
    while i in range(6):
        year = str(2013 + i)
        with open('.\static\innerData\province_AQI_IAQI\year\\'+year+'.csv', encoding= 'utf-8') as f:
            f_csv = csv.DictReader(f)
            for row in f_csv:
                if row['province'] == prov:
                    aqi.append(row['AQI'])
                    pm2_5.append(row['PM2.5_IAQI'])
                    pm10.append(row['PM10_IAQI'])
                    so2.append(row['SO2_IAQI'])
                    no2.append(row['NO2_IAQI'])
                    co.append(row['CO_IAQI'])
                    o3.append(row['O3_IAQI'])
        i += 1
    if aqi != []:
        return [aqi, pm2_5, pm10, so2, no2, co, o3]
    else:
        return 0
def getCity(city):
    i = 0
    aqi = []
    pm2_5 = []
    pm10 = []
    so2 = []
    no2 = []
    co = []
    o3 =[]
    while i in range(6):
        year = str(2013 + i)
        with open('.\static\innerData\city_AQI_IAQI\year\\'+year+'.csv', encoding= 'utf-8') as f:
            f_csv = csv.DictReader(f)
            for row in f_csv:
                if row['city'] == city:
                    aqi.append(row['AQI'])
                    pm2_5.append(row['PM2.5_IAQI'])
                    pm10.append(row['PM10_IAQI'])
                    so2.append(row['SO2_IAQI'])
                    no2.append(row['NO2_IAQI'])
                    co.append(row['CO_IAQI'])
                    o3.append(row['O3_IAQI'])
        i += 1
    if aqi != []:
        return [aqi, pm2_5, pm10, so2, no2, co, o3]
    else:
        return 0


@app.route("/")
def index():
    return render_template("index.html")

@app.route('/CalenderSetUp', methods=['POST','GET'])
def CalenderSetUp():
    if request.method == 'POST' :
        data = json.loads(request.get_data())
        if data['layer_geo']  == 'province':
            prov = data['prov']
            year = data['year']
            length = dt.date(int(year),12,31)-dt.date(int(year),1,1)
            for i in range(length.days + 1):
                day = dt.date(int(year),1,1) + dt.timedelta(days=i)
                day_str = day.strftime('%Y%m%d')
                data[day_str] = getProvDate(prov,day_str)
        elif data['layer_geo']  == 'city':
            city = data['city']
            year = data['year']
            length = dt.date(int(year),12,31)-dt.date(int(year),1,1)
            for i in range(length.days + 1):
                day = dt.date(int(year),1,1) + dt.timedelta(days=i)
                day_str = day.strftime('%Y%m%d')
                data[day_str] = getCityDate(city,day_str)
    return jsonify(data)

@app.route('/TimelineSetUp', methods=['POST','GET'])
def TimelineSetUp():
    if request.method == 'POST' :
        data = json.loads(request.get_data())
        if data['layer_geo']  == 'province':
            prov = data['prov']
            data['aqi'] = getProv(prov)
        elif data['layer_geo']  == 'city':
            city = data['city']
            data['aqi'] = getCity(city)
    return jsonify(data)

@app.route('/ThemeRiverSetUp', methods=['POST','GET'])
def ThemeRiverSetUp():
    data = {}
    if request.method == 'POST' :
        with open('.\static\innerData\\theme.csv', encoding= 'utf-8') as f:
            f_csv = csv.DictReader(f)
            i = 0
            for row in f_csv:
                data['ID'+str(i)] = [row['date'], row['value'], row['type']]
                i += 1
    return jsonify(data)

@app.route('/MapSetUp', methods=['POST','GET'])
def MapSetUp():
    if request.method == 'POST' :
        data = json.loads(request.get_data())
        year = int(data['year'])
        for i in data['children']:
            if data['layer_geo']  == 'province':
                if getProv(i['name']) != 0:
                    p = getProv(i['name'])
                    i['value'] = p[0][year-2013]
                    i['PM2_5'] = p[1][year-2013]
                    i['PM10'] = p[2][year-2013] 
                    i['SO2'] = p[3][year-2013] 
                    i['NO2'] = p[4][year-2013] 
                    i['CO'] = p[5][year-2013] 
                    i['O3'] = p[6][year-2013] 
            elif data['layer_geo']  == 'city':
                if getCity(i['name']) != 0:
                    p = getCity(i['name'])
                    i['value'] = p[0][year-2013]
                    i['PM2_5'] = p[1][year-2013]
                    i['PM10'] = p[2][year-2013]
                    i['SO2'] = p[3][year-2013] 
                    i['NO2'] = p[4][year-2013] 
                    i['CO'] = p[5][year-2013] 
                    i['O3'] = p[6][year-2013]


    return jsonify(data)

if __name__ == "__main__":
    app.run(debug = True)