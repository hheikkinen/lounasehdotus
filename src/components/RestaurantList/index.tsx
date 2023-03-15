import React from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Place, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Restaurant } from "../../views/MainView";
import { DateTime } from "luxon";
import { getLanguage } from "../../config";

const RestaurantList = ({
  city,
  date,
  restaurants,
}: {
  city: string;
  date: DateTime;
  restaurants: Restaurant[];
}) => {
  const { t } = useTranslation();

  const mapsLink = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    window.open(url, "_blank");
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant="h6">
          {city[0].toUpperCase() + city.slice(1)}{" "}
          {date.setLocale(getLanguage()).toLocaleString()}
        </Typography>
      </Grid>
      {restaurants.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1">{t("translation:lunchList.noResults")}</Typography>
        </Grid>
      )}
      {restaurants.map((restaurant) => (
        <Grid item xs={12} key={restaurant.id}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
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
    </React.Fragment>
  );
};

export default RestaurantList;
