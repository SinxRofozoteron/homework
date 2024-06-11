# Weather app

Assumptions:
- The user needs to enter the city name followed by a comma, a space, and the country name correctly to get the weather.
- If the user types in only a city name without a country, suggestions are displayed to clarify the city and the country.
- If the user misspells either a city or country name, suggestions are displayed to clarify the desired location.
- For the purpose of this demo, only temperature, precipitation, and wind speed information is displayed as weather conditions.

## Setup
1. Create virtual env and activate it:
```
python -m venv venv
# In cmd.exe
venv\Scripts\activate.bat
# In PowerShell
venv\Scripts\Activate.ps1
```
2. Install dependancies:
```
pip install -r requirements.txt
```
3. Configure database
```
python weather_app/manage.py migrate
```
4. Start the server:
```
python weather_app/manage.py runserver
```
5. Go to http://127.0.0.1:8000/