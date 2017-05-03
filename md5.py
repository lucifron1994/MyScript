#!/usr/bin/env python 
#encoding:utf-8 
import subprocess 
import os,sys

def getfileName(dir_path): 
    path_dict=[] 
    for dirpath,dirname,filenames in os.walk(dir_path): 
        for file in filenames: 
            obspath=os.path.join(dirpath,file)
            path_dict.append(obspath) 
    return path_dict 

if __name__ == '__main__': 
    md5_dict = {}  
    for filename in getfileName(sys.argv[1]):
        getcmd = 'md5 {0}'.format(filename)
        p = subprocess.Popen(getcmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        print("---")
        md5_val = p.communicate()[0].split("=")[-1].strip()
        print(md5_val)
        md5_dict[filename] = md5_val
 
    f = open(os.path.join(os.getcwd(),'md5'),'a')  
    for filename,md5_val in md5_dict.items():
        f.write(filename.split("/")[-1] + ' ' + md5_val + '\n') 
    f.close() 
