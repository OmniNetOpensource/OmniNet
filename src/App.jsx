import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SoapWord from "./components/ui/SoapWord";
import './styles/app.css'

// 常量
const WORDS_LINE1 = "we love making";
const WORDS_LINE2 = "cool stuffs";
// 多行段落文本
const PARAGRAPH =
  "好的念頭 是一切的開端 我們樂於動手將它實現 \n 不論這想法是自己苦思的 還是從眾人那裡得來的 每個念頭皆有其價值 \n 有時它清晰明確 有時仍有些模糊";


// soapword已经改成单个字符，app需要同步修改
export default function App() {
  return (
    <div id='app-container'>
      <div className="big-line">
        {
          WORDS_LINE1.split('').map(char => {
            return <SoapWord text={char} />
          })
        }
      </div>
      {
        PARAGRAPH.split('\n').map((textLine) => {
          return (
            <div className="small-paragraph">
              {textLine.split('').map(char => {
                return <SoapWord text={char} />
              })}
            </div>
          );
        })
      }
      <div className="big-line">
        {
          WORDS_LINE2.split('').map(char => {
            return <SoapWord text={char} />
          })
        }
      </div>
    </div>
  );
}
