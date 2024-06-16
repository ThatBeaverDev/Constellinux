Constellation's Terminal Is Based On the Unix Terminal.

The Full List Of Commands Is As Follows:
- cat
	- Returns the Full Contents of the inputted filename in the working directory.
	- eg:     Contents Of hi.txt: Hello, World. How are you?
		- ```cat hi.txt
		  Hello, World. How Are You?```
- cd
	- Changes the working directory, either by giving the name of a subdirectory of the working directory or by fully setting the working directory, by starting with / (root dir)
- clear
	- Clears the terminal panel. works will in conjunction with other commands (See [[Listing Commands In Terminal]])
	- eg:     Contents Of hi.txt: Hello, World. How are you?
		- ```cat hi.txt; clear
		 (clears terminal before this)
		  Hello, World. How Are You?
- cp
	- Copies a file from input 1 to input 2
	- eg:
		- ```ls
		  hi.txt     folder/
		  cp hi.txt hello.txt
		  ls
		  hi.txt    hello.txt    folder/
- dd
	- Wipes the Filesystem. **Use This If Terminal Displays No Directory and FIles Is Dysfunctional. This Deletes ALL DATA, Without Exception.**
- echo
	- Returns what was put into it. Works Well With Grep (see below)
	- eg:
		- ```echo hello, world
		  hello, world```
- grep
	- Grep is a complex linux command, in which the output of the command before (via [[Listing Commands In Terminal]]) it is written to it's first input
	- eg:
		- ```ls
		 folder/     my cat.png
		 echo Hi! This is going into a file; grep hi.txt
		 ls
		 folder/     cat.png     hi.txt
		 cat hi.txt
		 Hi! This is going into a file
	- another example, for extra info:
		- ```ls
		 folder/     my cat.png
		 ls; grep ls.txt
		 ls
		 folder/     my cat.png ls.txt
		 cat ls.txt
		 folder/     my cat.png
- head
	- Returns the first 10 lines of a text file. Good for big files
- ls
	- Returns the contents of the working directory
- mkdir
	- Creates a subdirectory of the working directory
- mv
	- Moves a file in the working directory. Also used for renaming
- printenv
	- Returns the value of [[System Variables]]. not really useful, but interesting nonetheless.
	- Will return a variable of the inputted name, and it there is no variable by that name it checks arrays.
- pwd
	- Tells you the working directory
- rm
	- Deletes a file / directory. to delete a directory remember to append / to the end.
- tail
	- Returns the last 10 lines of a text file. Good for big files
- touch
	- Has 2 Uses
		- Use #1 is creating blank files - the inputted filename is written to, blank, in the working directory
		- Use #2 is updating the last modified timestamp of the inputted file
- uname
	- Returns the name of the Operating System
	- Flags:
		- -a
			- Returns More Info About the Operating System
- uptime
	- Returns the system uptime.
	- Flags:
		- -m
			- returns time in minutes, instead of seconds
- wget
	- Pulls a file from the internet into the working directory, with input 1 being the URL and input 2 the filename
- whoami
	- Returns the username of the current user

Remember, All These Commands, Unless Stated Otherwise, Work Identically / Very Similarly in Linux Terminals, And Are lIkely Google-Able. Happy Terminal-ing

Updated 2/6/2024