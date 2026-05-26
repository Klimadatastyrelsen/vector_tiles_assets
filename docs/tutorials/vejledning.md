# Vejledning til brug af Vector Tiles - Skærmkort på Dataforsyningen
Vector Tiles Skærmkortet kan tilgåes igennem [kortvisningen](https://vectortiles.dataforsyningen.dk), og gennem [Dataforsyningen](https://dataforsyningen.dk/data/4995) kan du læse mere om produktet, og den fremadrettet udvikling.
Vector Tiles Skærmkort udstilles i 4 forskellige styles, det klassiske skærmkort, det dæmpet skærmkort, det grå skærmkort og i en ny udgave; det mørke skærmkort. Stylefilerne for disse 4 kort er tilgængelige under [styles/official](https://github.com/Klimadatastyrelsen/vector_tiles_assets/tree/main/styles/official), hvorfra brugeren kan hente disse ned, ændre i dem, og til sidst trække dem ind i kortvisningen og få vist sit helt eget kort.
Herunder finder du link til datamodellen for Vector Tiles - Skærmkort, samt en kort vejledning til hvordan du selv kan ændre i stylefilen, og få vist din egen udgave af skærmkortet, direkte i browseren.

[Datamodel](#datamodel)

[Generelt om stylefilerne](#stylefiles)

[Eksempel 1 -Dæmpet kort med farverige skove, søer og vandløb](#eksempel1)

[Eksempel 2 - Kort uden stednavne](#eksempel2)


## Datamodel <a name="datamodel"></a>
Datamodellen beskrives i detajler på [confluence](https://confluence.sdfi.dk/pages/viewpage.action?pageId=184517220).

De fleste data stammer fra GeoDanmark Vektor, derudover bruges også Danske Stednavne, Danmarks Adresseregister (DAR) og en række øvrige mindre datasæt. Data er selekteret for hvert zoom, Eks. Bygninger vil kun kunne medtages i de inderste levels/zoom. Datamodellen omfatter endnu ikke generaliseret data, hvilket bl.a. kan ses ved at der i de yderste zoomniveau fortsat vises mange veje.

> **Opdateringsfrekvens**
> Data opdateres hver den 1. lørdag i måneden.


## Generelt om stylefilerne <a name="stylefiles"></a>
Stylefilen er bygget op, så det er skrevet først i stylefilen bliver tegnet først og de efterfølgende objekttyper lægger sig oven på. Derfor vil rækkefølgen oftest være arealer først i filen, dernæst linjer og til sidst punkter.
Teksterne har typen symbol og bliver altid visuelt lagt øverst uanset, hvor man placerer dem i stylefilen.

Skalaer er i levels, hvor man populært kan sige at level 0 er verden og level 16 på bygningsniveau.

Opbygning er således

```
        {
            "id": "vand_sø",
            "source-layer": "vand",
            "minzoom": 7,
            "maxzoom": 13,
            "type": "fill",
            "filter": ["all", ["==", "type", "vandløbsflade"]],
            "paint": {
                "fill-color": "#e6f3fc"
            },
            "source": "vector-source"
        },
```

```"id"``` skal være unikt

```"source-layer"``` skal pege på en af objekttyperne listede i [datamodellen](#datamodel)

```"minzoom"``` indikere det mindste zoom hvor laget optræder

```"maxzoom"´``` indikere det største zoom hvor laget optræder

```"type"```  fill eller geometritype; polygon, line, point m.m.

```"filter"``` filter til at udvælge type og subtype

```"paint"``` visualisering (farve, størrelse osv.) Farverne er defineret i HEX, men kan nemt ændres til RGB.

```"fill-color": "#e6f3fc"```   eller   ```"fill-color": "RGB(230, 243, 252)"```


Der er også en række andre elemeneter der kan defineres i style filen. Eksempelvis er der et element kaldet for **stops**. Stops definere forskellige 'regler' i forskellige zoom niveauer. Fx i forhold til at angive tekst størrelsen. Inden hvor hver klamme parentes er der først angivet zoomniveau (level 0-16) og dernæst skriftstørrelse for det angivet zoomniveau. Det kan ekesempelvis så sådan ud:
```
                "text-size": {"stops": [[9, 12], [10, 13], [11, 13]]},
```

Dvs. at for level 9, skal skriftstørelsen (i dette tilfælde) være 12, i level 10 skal skriftstørelsen være 13 osv.
Stops kan også angive forskellige tykkelser på linjer i forskellige zoom niveauer mm.



## Eksempler
Herunder beskrives 2 eksempler på konkrete måder hvorpå brugeren selv kan lave om i stylefilerne, for på den måde at lave sit eget kort.
Udover de konkrete eksempler nævnt her, har brugeren også selv mulighed for at tilføje ydereligere data, som er markeret i datamodedllen med _bruges ikke_.


### Eksempel 1 -Dæmpet kort med farverige skove, søer og vandløb. <a name="eksempel1"></a>

Med udgangspunkt i det **dæmpet skærmkort**, ønskes et udtryk hvor skove, søer og vandløb alle fremhæves med markante farver. Dvs. i style filen er der udlukkende behov for at ændre farvekode for de ønskede lag.
Laget med skov søges frem i style filen og farvekoden ændres fra #EAFAE1, til eksempelvis #5be80c:

```
90        {
91            "id": "natur_skov",
92            "source-layer": "natur",
93            "type": "fill",
94			"filter": ["all", ["==", "type", "skov"]],
95            "paint": {
96                 "fill-color": "#5be80c"
97            },
98            "source": "vector-source"
99        },
```
Som det næste søges der efter ’sø’. Der kommer i alt tre resultater frem: ```vand_sø```, ```vand_sø_outline``` og ```vand_sø >50000```. Det kan ses at der vises forskellige lag af søer i forskellige skaler, derfor ændres farvekoden fra #D4E6F0 til eksempelvis #17ceed for laget ```vand_sø``` og ```vand_sø >50000```.

```
193		{
194            "id": "vand_sø",
195            "source-layer": "vand",
196			"minzoom": 13,
197			"maxzoom": 20,
198            "type": "fill",
199			 "filter": ["all", ["==", "type", "sø"]],
200            "paint": {
201                "fill-color": "#17ceed"
202            },
203            "source": "vector-source"
204   },
205		{
206            "id": "vand_sø_outline",
207            "source-layer": "vand",
208			"minzoom": 13,
209			"maxzoom": 20,
210            "type": "line",
211			 "filter": ["all", ["==", "type", "sø"]],
212            "paint": {
213                "line-color": "#BEE8FF",
214				"line-width": 0.8
215            },
216            "source": "vector-source"
217   },
218		{
219            "id": "vand_sø_>50000",
220            "source-layer": "vand",
221			"minzoom": 7,
222			"maxzoom": 13,
223            "type": "fill",
224			 "filter": ["all", ["==", "type", "sø"]],
225            "paint": {
226                "fill-color": "#17ceed"
227            },
228            "source": "vector-source"
229   },
```

Til sidst søges der på ’vandløb’. Her kan ses det at der er flere forskellige lag der definere style for vandløb, bl.a. ```vandloeb```, ```vandloeb_o12``` (vandløb der er over 12 meter i bredden) og ```vandloeb_rørlagt```. Alle disse tre har den samme farve kode, og den ændres således fra #BFE8F0 til #1e90ff.
De sidste to lag der kan søges frem er ```vand_vandløbsflade``` og ```vand_vandløbsflade_outline```. Herunder vælges at ```vand_vandløbsflade``` ændres fra #D4E6F0 til #17ceed (lige som for søerne)
Når disse ændringer er gemt, trækkes json filen direkte ind i browser under knappen ’Træk og slip din egen stylefil her for at tilføje den til kortet’ og så dukker dette kort frem i browseren:

![billede](https://github.com/Klimadatastyrelsen/vector_tiles_frontend/assets/168088613/ba8903a7-4e56-41e8-99e5-116525d039a8)



### Eksempel 2 -Kort uden stednavne. <a name="eksempel2"></a>

Med udgangspunkt i stylefilen for det **grå skærmkort** ønskes der at lave et kort i gråtoner, men uden vejnavne, stednavne eller andre former for tekster.
Når man kigger stylefilen igennem for det grå skærmkort ses det at der fra linje ```704``` og frem til linje ```1033``` udelukkende er tekst data. Disse linjer slettes derfor. Det sidste komma skal også slettes. Det sidste lag i filen er således punkter_togstation, og ser sådan her ud:
```
688	    {
689            "id": "punkter_togstation",
690            "source-layer": "punkter",
691			"minzoom" : 15,
692            "type": "circle",
693			"filter": ["all", ["==", "type", "togstation"]],
694			"layout": {
695                "icon-allow-overlap": false,
696                "icon-ignore-placement": false
697            },
698            "paint": {
699				"circle-color": "#C3C3C3",
700				"circle-radius": 10
701            },
702            "source": "vector-source"
703        }
704    ],
705    "metadata": {
706        "maputnik:renderer": "ol"
708    }
709  }
```
Når denne stylefile trækkes ind i kortvisningen ser det således således ud:

![billede](https://github.com/Klimadatastyrelsen/vector_tiles_frontend/assets/168088613/0a1372ff-665d-4ebd-ba3b-1ac6f5067fb7)


