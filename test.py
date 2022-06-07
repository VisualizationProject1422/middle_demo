import csv
import math
from re import I



with open('/Users/pengzzh/myproject/data/201301/CN-Reanalysis-daily-2013010100.csv', encoding = "utf8") as f:
    f_csv = csv.DictReader(f)
    fh = "(微克每立方米)"# 少写两次
    data = []
    AQI = []
    for line in f_csv:
        p1 = float(line['PM2.5'+fh])
        p2 = float(line[' PM10'+fh])
        p3 = float(line[' SO2'+fh])
        p4 = float(line[' NO2'+fh])
        p5 = float(line[' CO(毫克每立方米)'])
        p6 = float(line[' O3'+fh])
        u = float(line[' U(m/s)'])
        v = float(line[' V(m/s)'])
        k = float(line[' TEMP(K)'])
        rh = float(line[' RH(%)'])
        pa = float(line[' PSFC(Pa)'])
        lat = float(line[' lat'])
        lon = float(line[' lon'])

        iaqi1 = IAQI(p1, 1)
        iaqi2 = IAQI(p2, 2)
        iaqi3 = IAQI(p3, 3)
        iaqi4 = IAQI(p4, 4)
        iaqi5 = IAQI(p5, 5)
        iaqi6 = IAQI(p6, 6)
        speed = math.sqrt(u*u+v*v)
        temp = k - 273.15

        aqi = max(iaqi1, iaqi2, iaqi3, iaqi4, iaqi5, iaqi6)

        AQI.append([aqi, iaqi1, iaqi2, iaqi3, iaqi4, iaqi5, iaqi6])
        
print(data)