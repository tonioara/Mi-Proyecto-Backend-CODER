export const productValidator = (req, res, next) => {
    const { title, price, description, stock, code,category } = req.body;
    
    
    const validationRules = [
        { field: 'title', value: title, type: 'string', required: true },
        { field: 'price', value: price, type: 'number', required: true },
        { field: 'description', value: description, type: 'string', required: true },
        { field: 'stock', value: stock, type: 'number', required: true },
        { field: 'code', value: code, type: 'string', required: true },
        { field: 'category', value:category, type: 'string', required: true },

    ];

    for (const rule of validationRules) {
        if (rule.required && (rule.value === undefined || rule.value === null || rule.value === '')) {
            return res.status(400).json({ 
                error: `El campo '${rule.field}' es obligatorio y no puede estar vacío.`,
            });
        }
        
        
        if (rule.value !== undefined && rule.value !== null && typeof rule.value !== rule.type) {
            
            const typeName = rule.type.charAt(0).toUpperCase() + rule.type.slice(1);
            return res.status(400).json({ 
                error: `El campo '${rule.field}' debe ser de tipo ${typeName}.` 
            });
        }
    }
    
   
    next();
}