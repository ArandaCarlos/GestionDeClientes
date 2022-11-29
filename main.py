from flask import Flask, jsonify , request,render_template
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-type'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'system'

mysql = MySQL(app)

@app.route('/api/customers/<int:id>')
@cross_origin()
def getCustomer(id):
    cur = mysql.connection.cursor()
    cur.execute(
        f"SELECT id, first_name, last_name, email, phone, address from `customers` where `customers`.`id` = {id};")
    data = cur.fetchall()
    cliente = {}
    for row in data:
        cliente = {'id':row[0],'firstname':row[1],'lastname':row[2],'email':row[3],'phone':row[4]}
    return jsonify(cliente)

@app.route('/api/customers')
@cross_origin()
def getAllCustomers():
    cur = mysql.connection.cursor()
    cur.execute(
        f"SELECT id, first_name, last_name, email, phone, address from `customers`;")
    data = cur.fetchall()
    result = []
    for row in data:
        content = {'id': row[0], 'firstname': row[1], 'lastname': row[2], 'email': row[3], 'phone': row[4]}
        result.append(content)
    return jsonify(result)

@app.route('/api/customers', methods=['POST']) #post
@cross_origin()
def saveCustomer():
    if('id' in request.json):
        updateCustomer()
    else:
        createCustomer()
    return "cliente guardado"

def createCustomer():
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO `customers` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`) VALUES (NULL,%s,%s,%s,%s,%s);", (request.json['first_name'], request.json['last_name'], request.json['email'], request.json['phone'], request.json['address']))
    mysql.connection.commit()
    return "cliente guardado"

def updateCustomer():
    cur = mysql.connection.cursor()
    cur.execute("UPDATE `customers` SET `first_name` = %s, `last_name` = %s, `email` = %s, `phone` = %s, `address` = %s WHERE `customers`.`id` = %s;", (request.json['first_name'], request.json['last_name'], request.json['email'], request.json['phone'], request.json['address'], request.json['id']))
    mysql.connection.commit()
    return "cliente guardado"


@app.route('/api/customers/<int:id>', methods=['DELETE']) #post
@cross_origin()
def removeCustomer(id):
    cur = mysql.connection.cursor()
    cur.execute(
        f"DELETE FROM `customers` WHERE `customers`.`id` ={id};")
    mysql.connection.commit()
    return "cliente eliminado"

@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(None, 3000, True)