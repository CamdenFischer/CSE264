<?php include 'Top40DAO.php'; ?>
<!DOCTYPE html>
<html>
   <head> 
      <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
      <meta name ="viewport" content ="width=device-width, initial-scale=1">
      <title>Mobile Top 40</title>
      <link rel ="stylesheet" href ="http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css" />
      <script src ="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
      <script src ="http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js"></script>
   </head>
   <body>
      <div data-role="page">
         <div data-role="header">
            <h1>Mobile Top 40</h1>
         </div>
         <div data-role="content">
            <form method="get" action='results.php'>
               <label for="artist">Artist:</label>
               <select name='artist' id="artist">
                  <option>(none)</option>
                  <?php
                  $dao = new Top40DAO();
                  $artists = $dao->getArtistList();
                  foreach ($artists as $artist) {
                     echo "<option>$artist</option>";
                  }
                  ?>
               </select>
               <br><br>
               <label for="keyword">Keyword:</label>
               <input type="text" name="keyword" id="keyword"></input> 
               <br><br>
               <input type="submit" name="btn" value="Search"></input>
            </form>
         </div>
         <div data-role="footer" data-position="fixed"><small>&nbsp;BillBoard Top 40 songs from 1955-1981</small></div>
      </div>      
   </body>
</html>
