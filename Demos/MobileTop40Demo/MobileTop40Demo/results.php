<!DOCTYPE html>

<?php include 'Top40DAO.php'; ?>
<?php include 'SearchResultsRecord.php'; ?>

<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
      <title>Mobile Top 40 Results</title>
   </head>
   <body>
      <div data-role="page">
         <div data-role="header">
            <a href="#" data-role="button" data-rel="back">Search</a>
            <h1>Mobile Top 40 Results</h1>
         </div>
         <div data-role="content">      
            <ol data-role="listview" data-filter="true">
               <?php
               $dao = new Top40DAO();
               $artist = $_GET["artist"];
               $keyword = $_GET["keyword"];
               $songs = $dao->getSearchResults($artist, $keyword);
               $count = 1;
               foreach ($songs as $song) {
                  if ($song->numone) {
                     echo "<li>";
                  } else {
                     echo "<li>";
                  }
                  echo "$song->title";
                  echo "</li>";
                  $count++;
               }
               ?>
            </ol>
            <br>
         </div>
         <div data-role="footer" data-position="fixed"><small>&nbsp;BillBoard Top 40 songs from 1955-1981</small></div>
      </div>      
   </body>
</html>