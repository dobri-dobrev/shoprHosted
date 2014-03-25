import json,httplib
connection = httplib.HTTPSConnection('api.parse.com', 443)
connection.connect()
connection.request('POST', '/1/functions/hello', json.dumps({
     }), {
       "X-Parse-Application-Id": "hsF1YqRFuQ0rTousJrmzKLLcvEQNTfwXPwdvd7Kr",
       "X-Parse-REST-API-Key": "1FXV3HKdoE82ddv3g0tMJ4Xfla6BSOOViMPGdNSi",
       "Content-Type": "application/json"
     })
result = json.loads(connection.getresponse().read())
print result