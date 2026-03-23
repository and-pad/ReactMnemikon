import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material"
import { fetchDashboard } from "./APICalls";

const cards = [
  {
    title: "Piezas",
    key: "pieces",
    bg: "linear-gradient(to bottom right, #FFF9C4, #FFE082)",
  },
  {
    title: "Investigaciones",
    key: "research",
    bg: "linear-gradient(to bottom right, #FFE0B2, #FFB74D)",
  },
  {
    title: "Restauraciones",
    key: "restorations",
    bg: "linear-gradient(to bottom right, #FFCDD2, #EF9A9A)",
  },
  {
    title: "Movimientos",
    key: "movements",
    bg: "linear-gradient(to bottom right, #F8BBD0, #F48FB1)",
  },
  {
    title: "Reportes",
    key: "reports",
    bg: "linear-gradient(to bottom right, #E1BEE7, #CE93D8)",
  },
  {
    title: "Usuarios",
    key: "users",
    bg: "linear-gradient(to bottom right, #BBDEFB, #90CAF9)",
  },
  {
    title: "Roles",
    key: "roles",
    bg: "linear-gradient(to bottom right, #B2EBF2, #80DEEA)",
  },
  {
    title: "Valor total",
    key: "total_value",
    bg: "linear-gradient(to bottom right, #C8E6C9, #A5D6A7)",
  },
];



export const Home = ({accessToken, refreshToken, handleCheckLoginCallback}) => {
    const [dashboardData, setDashboardData] = useState(null);
    
    useEffect(() => {
        fetchDashboard({accessToken, refreshToken}).then((data) => {
            console.log(data);
            setDashboardData(data);
        });
      }, []);



  return (
    <div className="container mt-5">
     <div className="row justify-content-around align-items-center">    
     {cards.map((card) => (
  <div
    key={card.key}
    className="col-sm-12 col-md-5 col-xl-4 px-2"
  >
    <Box
      sx={{
        width: 300,
        p: 2,
        borderRadius: 3,
        background: card.bg,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        marginBottom: 2,
      }}
    >
      <Typography variant="h6">{card.title}</Typography>

      <Typography variant="h4" fontWeight="bold">
        {dashboardData ? dashboardData[card.key] : "—"}
      </Typography>
    </Box>
  </div>
))}
    </div>
    </div>
  );
}

/*

   <div class="row justify-content-around align-items-center">    
            <div class="col-sm-6 col-md-4 col-xl-3 px-2">
                <Box
                sx={{
                    width: 300,
                    p: 2,
                    borderRadius: 3,
                    background: "linear-gradient(to bottom right, #FFF9C4, #FFE082)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                >
                <Typography variant="h6">Título</Typography>
                <Typography variant="body2">
                    Fondo difuminado sin culpa.
                </Typography>
                </Box>
            </div>

            
        </div>

*/ 