import csv
import math
import json
import re

from datetime import date, timedelta


i = 0
d = date(2013, 1, 1)

data = []
print(d.strftime('%Y%m%d00'))
# while i < 365*6+1:
#     with open('/Users/pengzzh/myproject/static/innerData/city_AQI_IAQI/day/'+d.strftime('%Y%m%d00')+'.csv', encoding="utf8") as f:
#         a1 = 0
#         a2 = 0
#         a3 = 0
#         a4 = 0
#         a5 = 0
#         a6 = 0
#         f_csv = csv.DictReader(f)
#         for row in f_csv:
#             aqi = float(row['AQI'])
#             if aqi > 300:
#                 a6 += 1
#             elif aqi > 200:
#                 a5 += 1
#             elif aqi > 150:
#                 a4 += 1
#             elif aqi > 100:
#                 a3 += 1
#             elif aqi > 50:
#                 a2 += 1
#             else:
#                 a1 += 1
#         da = d.strftime('%Y-%m-%d')
#         data.append([da,a1,'优'])
#         data.append([da,a2,'良'])
#         data.append([da,a3,'轻度污染'])
#         data.append([da,a4,'中度污染'])
#         data.append([da,a5,'重度污染'])
#         data.append([da,a6,'严重污染'])
#     d = d + timedelta(days=1)
#     i += 1


# with open ('/Users/pengzzh/myproject/static/innerData/theme.csv', 'w', encoding="utf8", newline = '') as f:
#     f_csv = csv.writer(f)
#     # f_csv.writerow({'type', 'value', 'date'})
#     for i in data:
#         f_csv.writerow(i)
while i < 365*6+1:
    with open('/Users/pengzzh/myproject/static/innerData/city_AQI_IAQI/day/'+d.strftime('%Y%m%d00')+'.csv', encoding="utf8") as f:
        a1 = 0
        a2 = 0
        a3 = 0
        a4 = 0
        a5 = 0
        a6 = 0
        f_csv = csv.DictReader(f)
        for row in f_csv:
            aqi = float(row['AQI'])
            if aqi > 300:
                a6 += 1
            elif aqi > 200:
                a5 += 1
            elif aqi > 150:
                a4 += 1
            elif aqi > 100:
                a3 += 1
            elif aqi > 50:
                a2 += 1
            else:
                a1 += 1
        da = d.strftime('%Y-%m-%d')
        data.append({'date': da, 'value': a1, 'type': '优'})
        data.append({'date': da, 'value': a2, 'type': '良'})
        data.append({'date': da, 'value': a3, 'type': '轻度污染'})
        data.append({'date': da, 'value': a4, 'type': '中度污染'})
        data.append({'date': da, 'value': a5, 'type': '重度污染'})
        data.append({'date': da, 'value': a6, 'type': '严重污染'})
    d = d + timedelta(days=1)
    i += 1


with open('/Users/pengzzh/myproject/static/innerData/themedata.json', 'w', encoding="utf8", newline='') as f:
    f.write(json.dumps(data,ensure_ascii=False))
