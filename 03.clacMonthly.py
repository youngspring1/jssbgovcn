#!/usr/bin/pythonw
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import urllib.request
import csv

year = '2016'
month = 2 #All data start from Feb.
month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
quota_name = ['轻工业', '重工业', '城镇居民', '乡村居民']
city_name  = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市']

def main():
    cols = len(month_name) #12 months
    quota_data = [[0 for col in range(cols)] for row in range(len(quota_name))]
    city_data  = [[0 for col in range(cols)] for row in range(len(city_name))]


    # read 11 csv
    for month in range(2, 13):
        filename = 'data/' + year + '_' + str(month) + '_electricity.csv'
        matrix = read_csv(filename)
        #轻工业
        quota_data[0][month-1] = matrix[4][1]
        #重工业
        quota_data[1][month-1] = matrix[5][1]
        #城镇居民
        quota_data[2][month-1] = matrix[7][1]
        #乡村居民
        quota_data[3][month-1] = matrix[8][1]
        
        cityrow = 0
        for row in range(13, 28):
            if matrix[row][0] not in ['昆山市', '泰兴市', '沭阳县']:
                city_data[cityrow][month-1] = matrix[row][1]
                cityrow = cityrow + 1

    # make fake data for Jan
    for cityrow in range(len(city_name)):
        sum = 0.0
        for month in range(len(month_name)):
            sum += float(city_data[cityrow][month])
        city_data[cityrow][0] = str(sum / 11)

    # output industry/civil
    with open('data/' + year + '_all_electricity_quota.csv', 'w', newline='') as datacsv:
        csvwriter = csv.writer(datacsv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csvwriter.writerow(['分类/月份'] + month_name)
        for quotarow in range(len(quota_name)):
            temprow = []
            temprow.append(quota_name[quotarow])
            for month in range(len(month_name)):
                temprow.append(quota_data[quotarow][month])
            csvwriter.writerow(temprow)

    # output cities
    with open('data/' + year + '_all_electricity.csv', 'w', newline='') as datacsv:
        csvwriter = csv.writer(datacsv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csvwriter.writerow(['城市/月份'] + month_name)
        for cityrow in range(len(city_name)):
            temprow = []
            temprow.append(city_name[cityrow])
            for month in range(len(month_name)):
                temprow.append(city_data[cityrow][month])
            csvwriter.writerow(temprow)

    # output timeline json
    f = open('data/' + year + '_timeline.json', 'w')
    f.write(indentation(0) + '{\n')
    f.write(indentation(1) + '"monthlydata" : [\n')
    for month in range(len(month_name)):
        temprow = []
        for cityrow in range(len(city_name)):
            temprow.append(str(city_data[cityrow][month]))
        f.write(indentation(2) + '[' + ','.join(temprow) + ']')
        if month != len(month_name) - 1 :
            f.write(',\n')
        else:
            f.write('\n')
    f.write(indentation(1) + ']\n')
    f.write(indentation(0) + '}\n')
    f.close()

    # output all json
    f = open('data/' + year + '_all_electricity.json', 'w')
    f.write(indentation(0) + '{\n')
    f.write(indentation(1) + '"electricity" : [\n')

    for month in range(len(month_name)):
        #f.write(indentation(2) + '{\n')

        #f.write(indentation(3) + '"month" : ' + str(month+1) + ',\n')
        #f.write(indentation(3) + '{"' + month_name[month] + '" : [\n')
        f.write(indentation(2) + '{\n')
        f.write(indentation(3) + '"month" : [\n')

        for cityrow in range(len(city_name)):
            f.write(indentation(4) + '{')
            f.write(indentation(0) + '"name" : "' + city_name[cityrow] + '", ')
            f.write(indentation(0) + '"value" : ' + str(city_data[cityrow][month]) + '')
            if cityrow == (len(city_name)-1):
                f.write(indentation(0) + '}\n')
            else:
                f.write(indentation(0) + '},\n')

        f.write(indentation(3) + ']\n')

        if month  == (len(month_name)-1):
            f.write(indentation(2) + '}\n')
        else:
            f.write(indentation(2) + '},\n')

    f.write(indentation(1) + ']\n')
    f.write(indentation(0) + '}\n')
    f.close()

# read CSV file, get sentences
def read_csv(filename):
    matrix = []
    with open(filename, newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in spamreader:
            matrix.append(row)
    return matrix

def indentation(number):
    space = '    '
    return '' + space * number


if __name__ == '__main__':
    main()