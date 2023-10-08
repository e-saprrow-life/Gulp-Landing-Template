let scroll = new SmoothScroll({
    animationTime    : 800, // Время скролла 400 = 0.4 секунды
    stepSize         : 100, // Размер шага в пикселях 
    // Дополнительные настройки:
    accelerationDelta : 20,  // Ускорение 
    accelerationMax   : 2,   // Максимальное ускорение
    keyboardSupport   : true, // Поддержка клавиатуры 
    arrowScroll       : 50, // Шаг скролла стрелками на клавиатуре в пикселях
    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm   : true,
    pulseScale       : 4,
    pulseNormalize   : 1,
    touchpadSupport   : true, // Поддержка тачпада
});