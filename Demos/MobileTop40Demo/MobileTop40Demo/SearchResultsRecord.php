<?php

class SearchResultsRecord {
    public $artist;
    public $title;
    public $numone;

    function __construct($title, $artist, $numone) {        
        $this->artist = $artist;
        $this->title = $title;
        $this->numone = $numone;
    }   
}

?>
