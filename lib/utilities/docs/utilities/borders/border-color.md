# 边框颜色

使用'bd-*' 设置元素边框颜色

  <Example>
   <div
   v-for = "index in 2"
   :class="index===2 ? 'bd' : '' , 'bd-l-0', 'bd-r-0', 'bd-b-0' "
   class="flex flex-wrap gap-3 mt-1 ">
     <div :key="item"
     v-for = "item in index===1 ? arrayTheme : arrayNormal"
     class="w-16 h-20 mt-4" >
       <div :class="'bd-' + item.name"  class="bd w-16 h-8" ></div>
       <div class="text-center h-12">
         <div>{{item.name}}</div>
         <div>{{item.colorCode}}</div>
       </div>
     </div>
   </div>
 </Example>

```html
<div class="bd bd-primary ... ">
</div>
```

<script setup>
 const arrayTheme =  [
   {name:'primary',colorCode:'#2B80FF'},
   {name:'secondary',colorCode:'#37B2FE'},
   {name:'success',colorCode:'#17CE97'},
   {name:'warning',colorCode:'#FFA34D'},
   {name:'danger',colorCode:'#FF5858'},
   {name:'important',colorCode:'#FF4F9E'},
   {name:'special',colorCode:'#9D5EFF'},
 ];
 const arrayNormal = [
   {name:'white',colorCode:'#FFFFFF'},
   {name:'lighter',colorCode:'#F5F5F5'},
   {name:'light',colorCode:'#E3E4E9'},
   {name:'gray',colorCode:'#9EA3B0'},
   {name:'dark',colorCode:'#5E626D'},
   {name:'darker',colorCode:'#1B1F28'},
   {name:'black',colorCode:'#000000'},
   {name:'surface',colorCode:'#F5F5F5'},
   {name:'inverse',colorCode:'#3C4353'},
   {name:'transparent',colorCode:''},
   {name:'inherit',colorCode:''},
   {name:'current',colorCode:''},
 ]
</script>
