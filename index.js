const express 	= require('express');
const bodyParser= require('body-parser');
const {Client}	= require ('pg');			//conecction data base
const app		= express();

app.use(bodyParser.json());

//Testing Koneksi ke Postmen----------------------------------------------------------------------------

app.get('/coba',(req,res)=>{
	res.end("coba");
});


//conection Koneksi Postgre--------------------------------------------------------------------------------------------
//pemakaian modul psotgre untuk penggunaan data base
const conn = new Client({
					user :'postgres',
					password:'12345',
					host:"localhost",			//bisa 127.0.0.1
					post:5432,
					database:"nodejs_postgre"
});
conn.connect((err)=>{
	if(err)throw err;
	console.log('connect successfully');
});

//nampilin semua data-------------------------------------------------------------------------------

app.get('/api/siswa',(req, res)=>{
	let sql = "SELECT id, nama_lengkap, TO_CHAR(tanggal_lahir, 'dd-mm-yyyy') tanggal_lahir, alamat FROM siswa";
	let query = conn.query(sql,(err, results)=>{
		if (err) throw err;
		res.send(JSON.stringify({"status": 200, "error":null, "respone": results.rows}));	//rows nampilin data di panggil saja
		});
	});

//params (url)UNTUK MENGECEK ID--------------------------------------------------------------------------------

app.get('/api/siswa/:id',(req, res)=>{
	let sql = "SELECT id, nama_lengkap, TO_CHAR(tanggal_lahir, 'dd-mm-yyyy') tanggal_lahir, alamat FROM siswa WHERE id="+req.params.id;
	let query = conn.query(sql,(err, results)=>{
		if (err) throw err;
		res.send(JSON.stringify({"status": 200, "error":null, "respone": results.rows}));
		});
	});

//TAMBAH DI API-----mentod post-----------------------------------------------------------------------------

app.post('/api/tambah',(req, res)=>{
	let sql  = "INSERT INTO siswa (nama_lengkap,tanggal_lahir,alamat) values ('"+req.body.nama_lengkap+"','"+req.body.tanggal_lahir+"','"+req.body.alamat+"')";
	let query = conn.query(sql,(err, results)=>{
		if (err) throw err;
		res.send("Data Berhasil Ditambah");
/*		res.send(JSON.stringify({"status": 200, "error":null, "respone": results.rows}));
*/		});
	});

//Edit data berdasar kan id----------------------------------------------------------------------------------

app.put('/api/edit/:id',(req, res)=>{
	let sql  = "UPDATE siswa SET nama_lengkap='"+req.body.nama_lengkap+"', tanggal_lahir='"+req.body.tanggal_lahir+"', alamat='"+req.body.alamat+"' WHERE id="+req.params.id;
	let query = conn.query(sql, (err, results)=>{
		if (err) throw err;
		res.send("Data Berhasil Diedit");
/*		res.send(JSON.stringify({"status": 200, "error":null, "respone": results.rows}));
*/		});
	});

//delete-------------------------------------------------------------------------------------------------------

app.delete('/api/delete/:id',(req,res)=>{
	let sql  = "DELETE FROM siswa WHERE id="+req.params.id; /*isi sesuia id product*/
	let query = conn.query(sql, (err, results)=>{
		if (err) throw err;
		res.send("Data Berhasil Dihapus");
/*		res.send(JSON.stringify({"status": 200, "error":null, "respone": results.rows}));
*/
	});
});

//server Listening-----------------------------------------------------------------------------------

app.listen(8000, ()=>{
	console.log('server is running at port 8000');
});