const express = require('express');
const cors = require('cors');
var isBase64 = require('is-base64');


const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

function getMimeTypeFromBase64(base64String) {
    // The base64 string usually starts with 'data:[mime-type];base64,'
    const matches = base64String.match(/^data:(.+);base64,/);
  
    if (matches && matches.length > 1) {
      // Return the MIME type if it's found
      return matches[1];
    } else {
      throw new Error('Invalid base64 string');
    }
  }

function separateData(data) {
    const numbers = [];
    const alphabets = [];
    let highestLowerCase = null;

    data.forEach(item => {
        if (!isNaN(item)) {
        numbers.push(item);
        } else if (typeof item === 'string') {
        alphabets.push(item);
        if (item === item.toLowerCase()) {
            if (!highestLowerCase || item > highestLowerCase) {
            highestLowerCase = item;
            }
        }
        }
    });

    return { numbers, alphabets, highestLowerCase };
    }

    var signatures = {
        JVBERi0: "application/pdf",
        R0lGODdh: "image/gif",
        R0lGODlh: "image/gif",
        iVBORw0KGgo: "image/png",
        "/9j/": "image/jpg"
      };
      
function detectMimeType(b64) {
    for (var s in signatures) {
        if (b64.indexOf(s) === 0) {
        return signatures[s];
        }
    }
}

function fileSizeInBytes(base64) {
    const base64String = base64.replaceAll('=', '');
    const bytes = base64String.length * (3 / 4);

    return bytes;
}

app.post('/bfhl', async(req, res) =>{

    console.log(req);
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: 'Invalid data' });
    }

    const { numbers, alphabets, highestLowerCase } = separateData(data);

    console.log(numbers, alphabets, highestLowerCase);

    res.send({
        is_success:true,
        user_id: 'john_doe_17091999',
        email: 'john@xyz.com',
        roll_number: 'ABCD123',
        numbers:numbers,
        alphabets:alphabets,
        highest_lowercase_alphabet: highestLowerCase ? [highestLowerCase] : [],
        file_valid: isBase64(file_b64),
        file_mime_type: 'image/png',
        file_size_kb: fileSizeInBytes(file_b64)
    })
    
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });