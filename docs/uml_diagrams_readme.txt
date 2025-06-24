1. build diagram with plantuml https://plantuml.com/
2. access https://plantuml-editor.kkeisuke.dev/ page and generate .svg (press CTRL + Enter)
   file for both dark mode and light mode.
3. inspect svg element in browser and copy svg tag
4. create a folder in a directory you work and name it as .md file you build a page
5. create a file with .svg extension and paste the copied svg tag. Save it!
6. For each image with destination of dark or lightmode use HTML code below
   ! do not use multiple img with same data-theme in one <picture> tag
<picture class="theme-picture">
  <img src="./sample_darkmode.svg" alt="Sample" data-theme="dark">
  <img src="./sample_lightmode.svg" alt="Sample" data-theme="light">
</picture>