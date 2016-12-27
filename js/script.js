(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var slider = document.querySelector('#slider');

var items = slider.querySelectorAll('.slider__item');
var itemActive = 'slider__item--active';
var moveLeft = 'slider__item--moveLeft';
var moveRight = 'slider__item--moveRight';

var btnPrev = slider.querySelector('.slider__left');
var btnNext = slider.querySelector('.slider__right');

var dotsWrap = slider.querySelector('.slider__dots');
var dotActive = 'slider__dot--active';
var dot = document.createElement('div');
dot.classList.add('slider__dot');

var current = 0;

Array.prototype.forEach.call(items, function(item) {
  var dotClone = dot.cloneNode(true);

  if (item.classList.contains(itemActive)) dotClone.classList.add(dotActive);

  dotsWrap.appendChild(dotClone);
  var dots = dotsWrap.querySelectorAll('.slider__dot');

  Array.prototype.forEach.call(dots, function(el, index) {
    el.addEventListener('click', function(event) {
      activeItem(index);
    });
  });
});

btnPrev.addEventListener('click', function() {
  activeItem(--current);
});

btnNext.addEventListener('click', function() {
  activeItem(++current);
});

function activeItem(number) {
  var direction;

  if (number > items.length - 1) {
    current = 0
  } else if (number < 0) {
    current = items.length - 1;
  } else {
    current = number;
  }

  if (!items[current].classList.contains(itemActive)) {
    var dots = dotsWrap.querySelectorAll('.slider__dot');

    var activeSlide = slider.querySelector('.slider__item--active');
    if (activeSlide) activeSlide.classList.remove(itemActive);

    var activeDot = dotsWrap.querySelector('.slider__dot--active');
    if (activeDot) activeDot.classList.remove(dotActive);

    items[current].classList.add(itemActive);
    dots[current].classList.add(dotActive);
  }
}

activeItem(current);



// touch events

var startToush;

slider.addEventListener("touchstart", function(event) {
  startToush = event.targetTouches[0].clientX

  var slide = slider.querySelector('.slider__item--active');
  slide.classList.add('slider__item--inAction');
}, false);

slider.addEventListener("touchend", function() {
  var slide = slider.querySelector('.slider__item--active');
  slide.classList.remove('slider__item--inAction');
  slide.style.right = "";

  var activeDuration = window.innerWidth / 4;

  if (Math.abs(event.changedTouches[0].clientX - startToush) > 20) {
    if (event.changedTouches[0].clientX < activeDuration) {
      activeItem(++current);
    } else if ((window.innerWidth - event.changedTouches[0].clientX) < activeDuration) {
      activeItem(--current);
    }
  }
}, false);

slider.addEventListener("touchmove", function(event) {
  if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    var slide = slider.querySelector('.slider__item--active');
    var duration = startToush - touch.clientX;

    slide.style.right = (duration) + 'px';
  }
}, false);


},{}]},{},[1]);
