import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { api, changeLanguage } from "../../config";
import { DateTime } from "luxon";
import { AxiosResponse } from "axios";
import { Place, Search, Translate } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type Restaurant = {
  id: number;
  name: string;
  city: string;
  address: string;
  dishes: Dish[];
};

type Dish = {
  id: number;
  name: string;
  price: number;
  restaurantId: number;
};

const MainView = () => {
  const [city, setCity] = useState("");
  const [date, setDate] = useState(DateTime.now());
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const getLunchList = async () => {
    setRestaurants([]);
    setShowList(false);
    setLoading(true);
    api
      .get(`/lunches?city=${city}&date=${DateTime.now().toFormat("yyyy-LL-dd")}`)
      .then((res: AxiosResponse<Array<Restaurant>>) => {
        setRestaurants(res.data);
        setLoading(false);
        setShowList(true);
      })
      .catch((err: Error) => {
        console.error(err);
        setLoading(false);
      });
  };

  const clearList = () => {
    setCity("");
    setRestaurants([]);
    setShowList(false);
  };

  const mapsLink = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <IconButton
          style={{ position: "absolute", right: 0, top: 0 }}
          title={t("translation:main.language") as string}
          onClick={() => changeLanguage()}
        >
          <Translate />
        </IconButton>
        {!showList && (
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">{t("translation:search.title")}</Typography>
            </Grid>
            <Grid item xs={12}>
              {t("translation:search.description")}
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined">
                <TextField
                  placeholder={t("translation:search.placeholder") as string}
                  aria-label="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      getLunchList();
                      e.preventDefault();
                    }
                  }}
                  InputProps={{
                    endAdornment: !loading ? (
                      <IconButton aria-label="search" onClick={() => getLunchList()}>
                        <Search />
                      </IconButton>
                    ) : (
                      <CircularProgress size={20} />
                    ),
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        )}

        {showList && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">
                {city[0].toUpperCase() + city.slice(1)} {date.toFormat("m.d.yyyy")}
              </Typography>
            </Grid>
            {restaurants
              .filter((r) => r.dishes.length)
              .map((restaurant) => (
                <Grid item xs={12} key={restaurant.id}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">{restaurant.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {restaurant.dishes.map((dish: any) => (
                        <Typography variant="body1" key={dish.id}>
                          {dish.name}
                        </Typography>
                      ))}
                    </AccordionDetails>
                    <AccordionActions>
                      {restaurant.address && (
                        <IconButton
                          onClick={() => mapsLink(restaurant.address)}
                          title={t("translation:lunchList.location") as string}
                          style={{ color: "red" }}
                        >
                          <Place />
                        </IconButton>
                      )}
                    </AccordionActions>
                  </Accordion>
                </Grid>
              ))}
          </>
        )}

        {showList && (
          <Grid item xs={12} style={{ textAlign: "right" }}>
            <Button variant="text" onClick={() => clearList()}>
              <small>{t("translation:lunchList.return")}</small>
            </Button>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default MainView;
