export const loggerHttp = (req, res, next) => {
    const metodo = req.method.toUpperCase();
    const ruta = req.originalUrl; 
    const fecha = new Date().toISOString();
    console.log(`[${fecha}] ${metodo} ${ruta}`);
    next();
}
