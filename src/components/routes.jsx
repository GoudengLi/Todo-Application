import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from './components/map';


const routes = [
    {
      path: '/',
      element: <Todo />
    },
    {
      path: '/map',
      element: <Map />
    }
   
  ];
  
   

export default routes;