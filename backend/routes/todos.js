const express = require('express')
const oracledb = require('oracledb') 
const router = express.Router()
const {getPool} = require('./db')

router.get('/', async (req, res) => {
  let connection

  try {
    connection = await getPool().getConnection()
    const query = `SELECT id, title, status FROM todos`
    const result = await connection.execute(query)

    const todos = result.rows.map(row => ({
      id: row[0], 
      title: row[1], 
      status: row[2], 
    }))

    res.status(200).json(todos)
  } catch (err) {
    console.error('Error fetching todos:', err)
    res.status(500).json({error: err.message})
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
})

module.exports = router


router.post('/', async (req, res) => {
  const {title, status = 'pending'} = req.body
  let connection

  if (!title) {
    return res.status(400).json({error: 'Title is required'})
  }

  try {
    connection = await getPool().getConnection()
    const query = `INSERT INTO todos (title, status) VALUES (:title, :status) RETURNING id INTO :id`
    const idBind = {id: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}}

    const result = await connection.execute(query, {
      title: title,
      status: status,
      id: idBind.id,
    })

    await connection.commit()

    const newTodo = {
      id: result.outBinds.id[0],
      title,
      status,
    }

    res.status(201).json(newTodo)
  } catch (err) {
    console.error('Error creating todo:', err)
    res.status(500).json({error: err.message})
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
})

router.put('/:id', async (req, res) => {
  const {status} = req.body
  const id = req.params.id
  let connection

  if (!status) {
    return res.status(400).json({error: 'Status is required'})
  }

  try {
    connection = await getPool().getConnection()
    const query = `UPDATE todos SET status = :status WHERE id = :id`
    await connection.execute(query, {status, id})
    await connection.commit()

    res.status(200).json({id, status}) 
  } catch (err) {
    console.error('Error updating todo status:', err)
    res.status(500).json({error: err.message})
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
})
