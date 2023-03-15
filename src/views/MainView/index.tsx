import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { api, changeLanguage, municipalities } from "../../config";
import { DateTime } from "luxon";
import { AxiosResponse } from "axios";
import { Search, Translate } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import RestaurantList from "../../components/RestaurantList";

export type Restaurant = {
  id: number;
  name: string;
  city: string;
  address: string;
  dishes: Dish[];
};

export type Dish = {
  id: number;
  name: string;
  price: number;
  restaurantId: number;
};

const MainView = () => {
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const date = DateTime.now();

  const getLunchList = async () => {
    setRestaurants([]);
    setShowList(false);
    setLoading(true);
    api
      .get(`/lunches?city=${city}&date=${date.toFormat("yyyy-LL-dd")}`)
      .then((res: AxiosResponse<Array<Restaurant>>) => {
        setRestaurants(res.data.filter((r) => r.dishes.length));
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

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <IconButton
          style={{ position: "absolute", top: 10, right: 10 }}
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
            <Grid
              container
              direction="row"
              item
              xs={12}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <FormControl variant="outlined">
                  <Autocomplete
                    freeSolo
                    includeInputInList={false}
                    options={municipalities}
                    value={city}
                    autoHighlight
                    autoSelect
                    onChange={(e, value) => setCity(value as string)}
                    style={{ minWidth: 200, maxWidth: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("translation:search.placeholder") as string}
                        aria-label="city"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && municipalities.includes(city)) {
                            e.preventDefault();
                            getLunchList();
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid marginLeft={1}>
                <IconButton
                  aria-label="search"
                  onClick={() => getLunchList()}
                  disabled={loading || !municipalities.includes(city)}
                >
                  {!loading ? <Search /> : <CircularProgress size={20} />}
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        )}

        {showList && <RestaurantList city={city} date={date} restaurants={restaurants} />}

        {showList && (
          <Grid item xs={12}>
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
