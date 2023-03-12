const req = require("express/lib/request")

const Pool = require("pg").Pool

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('User and password environment variables must be set.');
    process.exit(1);
  }
  

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'estatedb',
})



const createinfo = (req,res) => {
    const {bhk, price, area,  address, available} = req.body;
    if(!bhk || !price || !area || !address || !available) {
        return res.status(400).json({
            msg: "Missing required fields"
        });
    }

    const floor = req.body.floor || null;
    const society = req.body.society || null;
    const contact = req.body.contact || null;
    
    pool.query(
        "INSERT INTO flatinfo (bhk, price, area, society, address, floor, available, contact) VALUES ($1,$2,$3,$4,$5,$6,$7, $8) RETURNING * ",
        [bhk, price, area, society, address, floor, available, contact],
        (err,result) => {
            if(err) {
                console.log(err);
                throw err;
            }

            res.status(201).json({
                msg: "Data inserted successfully",
                data: result.rows[0],
            });
        }
    );
};




const getinfo = (req,res) => {
    pool.query("SELECT * FROM flatinfo", (err,result) => {
        if(err) {
            console.log(err);
            throw err;
        }
        res.status(201).json(result.rows);
    });
};

const getinfoById = (req,res) => {

    let id = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).json({
        error: 'Invalid ID'
        });
        return;
        }

    pool.query("SELECT * FROM flatinfo WHERE id = $1",[id], (err,result) => {
        if(err) {
            console.log(err);
            throw err;
        }
        res.status(200).json(result.rows);
    });
};

const updateinfo = (req,res) => {

    let id = parseInt(req.params.id)
    const {bhk, price, area, society, address,floor, available, contact} = req.body;

    pool.query('UPDATE flatinfo SET bhk = $1, price = $2, area = $3, society= $4, address= $5, floor= $6, available=$7, contact=$8  WHERE id=$9 ',[bhk, price, area, society, address, floor, available, contact, id],
    (err,result) => {
        if(err) {
            console.log(err);
            throw err;
        }
        res.json({
            data:"Updated Successfully"
        })
    });
};

const deleteinfo = (req,res) => {

    let id = parseInt(req.params.id)
    const {bhk, price, area, society, address,floor, available, contact} = req.body;

    pool.query('DELETE from flatinfo WHERE id=$1',[id],(err,result)=> {
        if(err) {
            console.log(err);
            throw err;
        }
        res.json({
            msg: `Employee with Id ${id} deleted successfully`
        })
    });
};

const getFlatInfoByPriceRange = (req, res) => {
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
    res.status(400).json({
    error: 'Invalid price range'
    });
    return;
    }
    pool.query('SELECT * FROM flatinfo WHERE price >= $1 AND price <= $2 ORDER BY price', [minPrice, maxPrice], (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json({
            data: result.rows
        });
    });

}


module.exports = {
    createinfo, getinfo, updateinfo, getinfoById ,deleteinfo, getFlatInfoByPriceRange
}