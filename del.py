#!/usr/bin/env python
import os, sys;

def walk(path):
	for item in os.listdir(path):
		  filePath = path+"/"+item
		  if(item == ".DS_Store"):
			global count
			count = count+1
			print(filePath)
			if os.path.exists(filePath):
				os.remove(filePath)
			else:
				print("No such File!")
		  else:
			 if(os.path.isdir(filePath)):
			 	walk(filePath)
			 else:
			     print("")
		 
			
if __name__=='__main__' :
	count = 0
	if(len(sys.argv)>1):
		root_dir = sys.argv[1]
	else:
		root_dir = os.getcwd()
	walk(root_dir)
	print("\ntotal number:"+str(count))
